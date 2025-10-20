import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()){
                return res.status(429).json({ message: "Too many requests. Please try again later." });
            }
    
            else if (decision.reason.isBot()){
                return res.status(403).json({ message: "Access denied for bots." });    
            }

            else{
                return res.status(403).json({ message: "Request blocked by Arcjet." });
            }
        }

        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Access denied for spoofed bots." });
        }

        next();

    } catch (error) {
        console.log("Arcjet protection error:", error);
        next();
    }
};
