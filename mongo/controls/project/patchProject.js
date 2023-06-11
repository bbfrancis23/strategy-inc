import db from '/mongo/db';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';

import Project from '/mongo/schemas/ProjectSchema';

import axios from 'axios';

export const patchProject = async (req, res) => {
  const { projectId } = req.query;

  let status = axios.HttpStatusCode.Ok;
  let message = '';
  let project = undefined;

  const authSession = await getSession({ req });

  await db.connect();

  if (authSession) {
    project = await Project.findById(projectId);

    if (project) {
      if (project.leader._id.toString() === authSession.user.id) {
        if (req.body.title) {
          const { title } = req.body;
          project.title = title;
        } else if (req.body.addMember) {
          project.members.push(req.body.addMember);
        } else if (req.body.removeMember) {
          project.members.pull({ _id: req.body.removeMember });
        } else if (req.body.makeAdmin) {
          project.members.pull({ _id: req.body.makeAdmin });
          project.admins.push(req.body.makeAdmin);
        } else if (req.body.removeAdmin) {
          project.admins.pull({ _id: req.body.removeAdmin });
          project.members.push(req.body.removeAdmin);
        }

        try {
          await project.save();

          project = await Project.findOne({ _id: projectId })
            .populate('leader', '-password -authCode')
            .populate('admins', '-password -authCode')
            .populate('members', '-password -authCode');

          project = await project.toObject({
            getters: true,
          });

          console.log(project);
        } catch (e) {
          status = 500;
          message = `Updating Item failed: ${e}`;
        }
      } else {
        status = axios.HttpStatusCode.Unauthorized;
        message = 'You do not have authorization to change the project';
      }
    } else {
      status = axios.HttpStatusCode.NotFound;
      message = 'Project no found';
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized;
    message = 'You must be logged in.';
  }

  await db.disconnect();

  res.status(status).json({
    message,
    project,
  });
  return;
};
