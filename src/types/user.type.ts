
namespace UserNS {
    export interface User {
        _id: string,
        email: string,
        password: string,
        image?: string,
        role?: string,
        fullName: string;
    }
}
export default UserNS;