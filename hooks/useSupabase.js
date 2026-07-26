import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";

/**
 * Hook to fetch property listings with optional filtering
 */
export function useProperties(filter = {}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("properties").select("*").order("created_at", { ascending: false });

      if (filter.isFeatured) {
        query = query.eq("is_featured", true);
      }
      if (filter.type && filter.type !== "All") {
        query = query.eq("type", filter.type);
      }
      if (filter.searchQuery) {
        query = query.or(`title.ilike.%${filter.searchQuery}%,city.ilike.%${filter.searchQuery}%`);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setProperties(data || []);
    } catch (e) {
      console.log("Error fetching properties:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter.isFeatured, filter.type, filter.searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refresh: fetchProperties };
}

/**
 * Hook to fetch saved favorite properties for a user
 */
export function useSavedProperties(userClerkId) {
  const [savedIds, setSavedIds] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!userClerkId) {
      setSavedIds([]);
      setSavedProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_properties")
        .select("property_id, properties(*)")
        .eq("user_clerk_id", userClerkId);

      if (error) throw error;

      const ids = data ? data.map((item) => item.property_id) : [];
      const props = data ? data.map((item) => item.properties).filter(Boolean) : [];

      setSavedIds(ids);
      setSavedProperties(props);
    } catch (e) {
      console.log("Error fetching saved properties:", e);
    } finally {
      setLoading(false);
    }
  }, [userClerkId]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = async (propertyId) => {
    if (!userClerkId) return false;

    const isCurrentlySaved = savedIds.includes(propertyId);

    if (isCurrentlySaved) {
      // Optimistic update
      setSavedIds((prev) => prev.filter((id) => id !== propertyId));
      setSavedProperties((prev) => prev.filter((p) => p.id !== propertyId));

      await supabase
        .from("saved_properties")
        .delete()
        .eq("user_clerk_id", userClerkId)
        .eq("property_id", propertyId);
    } else {
      // Optimistic update
      setSavedIds((prev) => [...prev, propertyId]);

      await supabase.from("saved_properties").insert({
        user_clerk_id: userClerkId,
        property_id: propertyId,
      });
    }

    fetchSaved();
    return !isCurrentlySaved;
  };

  return { savedIds, savedProperties, loading, toggleSave, refresh: fetchSaved };
}

/**
 * Helper to sync user profile into Supabase
 */
export async function syncUserToSupabase(user) {
  if (!user || !user.emailAddress) return;

  const clerkId = user.clerkId || user.emailAddress;

  try {
    const { error } = await supabase.from("users").upsert(
      {
        clerk_id: clerkId,
        email: user.emailAddress,
        first_name: user.firstName || "",
        last_name: user.lastName || "",
        avatar_url: user.avatarUrl || "",
      },
      { onConflict: "clerk_id" }
    );

    if (error) console.log("User sync error:", error);
  } catch (e) {
    console.log("User sync exception:", e);
  }
}
