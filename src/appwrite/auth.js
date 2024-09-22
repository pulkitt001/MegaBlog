import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                const session = await this.login({ email, password });
                return session; // Return the session on successful login
            }
        } catch (error) {
            console.error("Error creating account:", error.message);
            throw error; // Rethrow for further handling
        }
    }

    async login({ email, password }) {
        try {
            const session = await this.account.createSession(email, password);
            console.log("Logged in successfully:", session);
            return session; // Return the session on successful login
        } catch (error) {
            console.error("Error logging in:", error.message);
            throw error; // Rethrow for further handling
        }
    }

    async getCurrentUser() {
        try {
            // Check if the user is logged in
            const user = await this.account.get();
            console.log("Current user:", user);
            return user; // Return the current user
        } catch (error) {
            console.error("Error fetching current user:", error.message);
            if (error.code === 401) {
                console.warn("Unauthorized access. User is not logged in.");
            }
            return null; // Return null if there's an error
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
            console.log("User logged out successfully.");
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    }
}

const authService = new AuthService();

export default authService;
