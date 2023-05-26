import { getSession } from 'next-auth/react';
import Member from '../../../mongo/schemas/MemberSchema';
import db from '/mongo/db';

import { createMemberTag } from '../../../mongo/controllers/memberControllers';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: 'Not Authenticated' });
      return;
    }

    await db.connect();
    const member = await Member.findOne({ email: session?.user?.email });

    if (!member) {
      await db.disconnect();
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    let result = undefined;

    let updateOptions = undefined;

    if (req.body.memberName) {
      updateOptions = { name: req.body.memberName };
    } else if (req.body.email) {
      const { email } = req.body;

      if (!email || !email.includes('@')) {
        res.status(422).json({ message: 'Invalid Input' });
        return;
      }

      let existingUser = {};
      try {
        existingUser = await Member.findOne({ email });
      } catch (error) {
        await db.disconnect();
        res.status(500).json({ message: `Server Error:  ${error}` });
        return;
      }

      if (existingUser) {
        await db.disconnect();
        res.status(422).json({
          message: 'Could not update email address. Member already exists.',
        });
        return;
      }

      updateOptions = { email: req.body.email };
    } else if (req.body.addTag) {
      try {
        await createMemberTag(member, req.body.addTag);
      } catch (e) {
        await db.disconnect();
        res.status(500).json({ message: `error: ${e}` });
        return;
      }

      await db.disconnect();

      res.status(200).json({
        message: 'Tag added',
        user: 'member would go here',
      });
      return;
    }

    if (updateOptions) {
      try {
        result = await Member.updateOne(
          { email: session?.user?.email },
          { $set: updateOptions }
        );
      } catch (e) {
        console.log(e);
      }
    }

    await db.disconnect();

    res.status(200).json({
      message: 'name updated',
      user: result.user ? result.user : undefined,
    });
  }
}
