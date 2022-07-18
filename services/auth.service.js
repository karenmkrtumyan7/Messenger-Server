const { User, Role, Permission } = require('../helpers/db');
const bcrypt = require('bcryptjs');
const mailer = require('../helpers/mailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config;

dotenv();

module.exports = {
    signIn,
    signUp,
    verifyAccount
}

async function signIn({ userName, password }) {
    const candidate = await User.findOne({ userName });

    if (!candidate) {
        throw { msg: 'Uncorrect username or password.' };
    }

    const hashedPassword = candidate.password;
    const isPasswordCorrect  = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) {
        throw { msg: 'Uncorrect username or password' };
    }

    if (!candidate.verified) {
        throw { msg: 'User is not verified' };
    }

    const userId = candidate.id;
    const token = await jwt.sign(
        { userId, role: candidate.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, userId }
}

async function signUp({ email, password, userName, contact }) {
    const emailCandidate = await User.findOne({ email });

    if (emailCandidate) {
        throw ({
            msg: 'The email address is already in use by another account.',
        });
    }

    const userNameCandidate = await User.findOne({ userName });

    if (userNameCandidate) {
        throw ({
            msg: 'The username is already in use by another account.',
        });
    }

    const hashedPassword  = await bcrypt.hash(password, 12);
    const permissions = new Permission();
    const userRole = new Role({ value: 'User', isAdmin: false, permissions });
    const user = new User({ email, password: hashedPassword, userName, contact, role: userRole });
    const userId = user.id;

    await Promise.all([permissions.save, userRole.save, user.save]);
    mailer(email, userName, userId);

    return { msg: 'Verify your account.'}
}

async function verifyAccount({ id }) {
    let candidate;
    try {
        candidate = await User.findById(id);
    } catch {
        candidate = null;
    }

    if (!candidate || candidate.verified) {
        throw { msg: 'There is no user or account is already verified.' };
    }

    await candidate.updateOne({ verified: true });
    return { msg: 'Account is successfully verified' };
}
