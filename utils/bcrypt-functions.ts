import * as bcrypt from 'bcrypt';

export const hashPassword = (password): string | Error => {
    try {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);

    } catch (error) {
        throw new Error('Something went wrong');
    }
};

export const isPasswordCorrect = (passwordEntered, hashedPassword): boolean => {
    try {
        return bcrypt.compareSync(passwordEntered, hashedPassword);

    } catch (error) {
        console.log(error);
    }
    return false;
};
