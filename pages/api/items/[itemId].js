import db from '/mongo/db';
import Item from '/mongo/schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import { getSession } from 'next-auth/react';
import { ObjectId } from 'mongodb';
import { getMember, flattenMember } from '/mongo/controllers/memberControllers';

import mongoose from 'mongoose';
import { getItem } from '../../../mongo/controllers/itemOld';
import { patchItem } from 'mongo/controllers/itemControllers/patchItem';

import { deleteItem } from 'mongo/controllers/itemControllers/deleteItem';

/* eslint-disable */

export default async function handler(req, res) {
  const { itemId } = req.query;
  if (req.method === 'PATCH') {
    await patchItem(req, res);
    return;
  } else if (req.method === 'DELETE') {
    await deleteItem(req, res);
    return;
    // let status = 200;
    // let message = '';
    // await db.connect();
    // let item = {};
    // try {
    //   item = await Item.findById(itemId)
    //     .populate({ path: 'tags', model: Tag })
    //     .populate({ path: 'sections', model: Section });
    // } catch (e) {
    //   message = `Error finding Item: ${e}`;
    //   status = 500;
    // }
    // if (status === 200) {
    //   if (item) {
    //     const session = await getSession({ req });
    //     const isSiteAdmin = session?.user.roles.includes('SiteAdmin');
    //     if (isSiteAdmin) {
    //       if (req.method === 'DELETE') {
    //         const session = await mongoose.startSession();
    //         try {
    //           session.startTransaction();
    //           await item.sections.forEach((s) => {
    //             Section.deleteOne({ _id: s._id.toString() });
    //           });
    //           await Item.deleteOne({ _id: ObjectId(itemId.toString()) });
    //           session.endSession();
    //         } catch (e) {
    //           await session.abortTransaction();
    //           session.endSession();
    //           status = 500;
    //           message = `Error deleting Item: ${e}`;
    //         }
    //       }
    //     } else if (session) {
    //       // if (req.method === 'PATCH') {
    //       //   const { title, tags } = req.body;
    //       //   if (tags) {
    //       //     const member = await getMember(session.user?.email);
    //       //     item.tags = [];
    //       //     tags.forEach((t) => {
    //       //       member.member.tags.filter((mt) => {
    //       //         if (mt.id === t) {
    //       //           item.tags.push(t);
    //       //         }
    //       //       });
    //       //     });
    //       //   }
    //       // }
    //     } else {
    //       status = 401;
    //       message = 'Not Authenticated.';
    //     }
    //   } else {
    //     status = 404;
    //     message = `Item: ${itemId} not found.`;
    //   }
    // }
    // await db.disconnect();
    // res.status(status).json({
    //   message,
    //   item: item ? item.toObject({ getters: true }) : undefined,
    // });
  } else if (req.method === 'GET') {
    const result = await getItem(itemId);

    res.status(result.status).json({
      message: result.message,
      item: result.item,
    });
  }
}
