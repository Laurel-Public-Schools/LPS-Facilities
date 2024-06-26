"use server";

import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import moment from "moment-timezone";

import { api } from "@/trpc/server";

export async function CreateGoogleEvent(id: number) {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const approvedDate = await api.reservation.dateById({ id: id });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startDateTime = moment
    .tz(
      `${approvedDate?.startDate} ${approvedDate?.startTime}`,
      "America/Denver",
    )
    .toISOString();

  const endDateTime = moment
    .tz(`${approvedDate?.endDate} ${approvedDate?.endTime}`, "America/Denver")
    .toISOString();

  const event = {
    summary: approvedDate?.Reservation.eventName,

    description: approvedDate?.Reservation.details,
    start: {
      dateTime: startDateTime,
      timeZone: "America/Denver",
    },
    end: {
      dateTime: endDateTime,
      timeZone: "America/Denver",
    },
  };
  try {
    await calendar.events.insert({
      calendarId: approvedDate?.Reservation.Facility.googleCalendarId,
      requestBody: event,
    });
  } catch (error) {
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
  return NextResponse.json({
    status: 200,
    message: "google cal events created",
  });
}
