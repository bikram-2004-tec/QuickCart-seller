import { Inngest } from "inngest";
import connectDB from "./db.js";
import User from "../model/user.js";

export const inngest = new Inngest({ id: "QuickCart-next" });

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url || "",
      };

      await User.findByIdAndUpdate(id, userData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });

      console.log("✅ User created:", id);
    } catch (error) {
      console.error("❌ syncUserCreation error:", error);
      throw error;
    }
  }
);

export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;

      const userData = {
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        imageUrl: image_url || "",
      };

      await User.findByIdAndUpdate(id, userData, { new: true });

      console.log("✅ User updated:", id);
    } catch (error) {
      console.error("❌ syncUserUpdation error:", error);
      throw error;
    }
  }
);

export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const { id } = event.data;

      await User.findByIdAndDelete(id);

      console.log("✅ User deleted:", id);
    } catch (error) {
      console.error("❌ syncUserDeletion error:", error);
      throw error;
    }
  }
);