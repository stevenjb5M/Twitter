import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("User not found");
        }

        return [ user, FakeData.instance.authToken ];
    }
}