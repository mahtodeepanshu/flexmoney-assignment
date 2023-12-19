import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    const serializableId = typeof id === 'object' ? id.toString() : id;

    return jwt.sign({ id: serializableId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

export default generateToken;