export default class AuthSession {
    public userId: number;
    public name: string;
    public email: string;
    public isAnonymous: boolean;
    public settings: {[key: string]: string};
}
