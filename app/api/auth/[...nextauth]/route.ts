
import { api_endpoints } from "@/utils/api_constants";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


// Extend the built-in session type
declare module "next-auth" {
    interface Session {
        id?:string;
        accessToken?: string;
        role?:string; 
        permissions?:string[];
        tokenExpiry?:string
    }

    interface User {
        id: string;  // Required field
        accessToken?: string;
        role?:string;
        permissions?:string[]; 
        tokenExpiry?:string
       
    }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
    interface JWT {
        id?:string;
        accessToken?: string;
        role?:string;
        permissions?:string[]; 
        tokenExpiry?:string
       
    }
}



 const authOptions: AuthOptions ={
    providers:[
        CredentialsProvider({
            name: "credentials",
            credentials:{
                email:{
                    label: "Email",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },

            async authorize(credentials) {

                if (!credentials) {
                    return null;
                }

                const { email, password } = credentials;
                try {
                    const res = await fetch(api_endpoints.login, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        }),
                    });
            
                    const user = await res.json();
                  
                  
                    // Check if the response is successful
                    if (user.status === "success") {
                
                        return {
                            id: user.id,
                            accessToken: user.token,
                            role: user.role,
                            permissions: user.permissions,
                            tokenExpiry: user.tokenExpiry, 
                        };
                    } 
             

                    
                    else  if (!res.ok || user.status === "failure") {
                        throw new Error(user.message || "Authentication failed");
                    }
                    else {
                        return null
                        }
                } 
                // eslint-disable-next-line @typescript-eslint/no-unused-vars                                      
                catch (error) {
                   throw new Error(error instanceof Error ? error.message : "Authentication failed");
    }
            }
        })
    ],

    pages:{
        signIn: "/auth/signin",
        signOut: "/auth/signout"
    },

    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({token, user}){
            if (user){
                token.accessToken = user.accessToken;
                token.role = user.role;
                token.id =user.id;
                token.permissions= user.permissions;
                token.tokenExpiry = user.tokenExpiry;
            
            }
            if (token.tokenExpiry && Date.now() > new Date(token.tokenExpiry).getTime()) {
                return { token}; // Invalidate token if expired
              }
            
            return token;
        },
        async session({ session, token }) {
     
            session.id = token.id as string;
            session.accessToken = token.accessToken as string;
            session.role = token.role as string;
            session.permissions = token.permissions as string[];
            session.tokenExpiry = token.tokenExpiry as string; // Store token expiry in the session
            return session;
          },
        
    },
   
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
