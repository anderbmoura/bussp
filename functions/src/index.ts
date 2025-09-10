import {onRequest} from "firebase-functions/v2/https";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.json({result: "Hello from Firebase!"});
});

export const createUserProfile = onDocumentCreated("users/{userId}", (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.info("No data associated with the event");
    return;
  }

  const data = snapshot.data();
  logger.info("User created:", data);

  // Example: Initialize user profile with default values
  return snapshot.ref.update({
    createdAt: new Date(),
    updatedAt: new Date(),
    profileComplete: false,
  });
});

export const getBusData = onRequest(async (request, response) => {
  try {
    const db = getFirestore();
    const busesRef = db.collection("buses");
    const snapshot = await busesRef.get();

    const buses: any[] = [];
    snapshot.forEach((doc) => {
      buses.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    response.json({
      success: true,
      data: buses,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error fetching bus data:", error);
    response.status(500).json({
      success: false,
      error: "Failed to fetch bus data",
    });
  }
});

export const updateBusLocation = onRequest(async (request, response) => {
  try {
    const {busId, latitude, longitude} = request.body;

    if (!busId || !latitude || !longitude) {
      response.status(400).json({
        success: false,
        error: "busId, latitude, and longitude are required",
      });
      return;
    }

    const db = getFirestore();
    const busRef = db.collection("buses").doc(busId);

    await busRef.update({
      location: {
        latitude,
        longitude,
      },
      lastUpdated: new Date(),
    });

    response.json({
      success: true,
      message: "Bus location updated successfully",
    });
  } catch (error) {
    logger.error("Error updating bus location:", error);
    response.status(500).json({
      success: false,
      error: "Failed to update bus location",
    });
  }
});