import db from '/mongo/db';
import Member from '/mongo/schemas/MemberSchema';
import Role from '/mongo/schemas/RoleSchema';

import Organization from '/mongo/schemas/OrganizationSchema';

import Tag from '/mongo/schemas/TagSchema';

import axios from 'axios';
import mongoose from 'mongoose';

import { flattenTag } from './tagsControllers';

import { ObjectId } from 'mongodb';

export const flattenMember = async (member, basic = false) => {
  delete member._id;

  if (member.roles) {
    member.roles = member.roles.map((r) => r.toString());
  }

  let tempTags = [];
  for (let tag of member.tags) {
    tag = await flattenTag(tag);
    tempTags.push(tag);
  }

  if (basic) {
    member = {
      id: member.id,
      email: member.email,
      name: member.name ? member.name : '',
    };
  }

  return member;
};

export const getMemberOrgs = async (memberId) => {
  await db.connect();

  let orgs = {};

  orgs = await Organization.find({
    $or: [{ leader: memberId }, { members: memberId }],
  });

  await db.disconnect();

  return orgs;
};

export const getMembers = async () => {
  await db.connect();

  let members = null;

  members = await Member.find();

  if (members) {
    members = await members.map((m) => {
      m = m.toObject({ getters: true });
      m = flattenMember(m, true);
      return m;
    });
  }

  await db.disconnect();

  return members;
};

export const createMemberTag = async (member, title) => {
  await db.connect();

  if (member && title) {
    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const newTag = new Tag({ title });
      await newTag.save({ dbSession });

      await member.tags.push(newTag);

      await member.save({ dbSession });
      await dbSession.commitTransaction();
    } catch (e) {
      console.log('there was an error', e);

      await dbSession.abortTransaction();
      dbSession.endSession();
      throw new Error({ message: `Error: ${e}` });
    }
  } else {
    throw new Error({ message: 'Missing Data' });
  }

  await db.disconnect();

  return member;
};

export const getMember = async (email) => {
  let status = 200;
  let message = 'found member';
  let member = null;

  await db.connect();

  try {
    member = await Member.findOne({ email })
      .populate({
        path: 'roles',
        model: Role,
      })
      .populate({ path: 'tags', model: Tag });
  } catch (e) {
    message = `Error finding Member: ${e}`;
    status = 500;
  }

  await db.disconnect();

  if (status === 200) {
    if (member) {
      member = await member.toObject({ getters: true, flattenMaps: true });
      member = await flattenMember(member);
    } else {
      status = 404;
      message = `Member: ${email} not found.`;
    }
  }

  return {
    status,
    message,
    member: member ? member : undefined,
  };
};
