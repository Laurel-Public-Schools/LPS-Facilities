import type { GoogleEvents } from "@/lib/types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import moment from "moment-timezone";

import { FacilityQuery, GetApprovedDates } from "@local/db/queries";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: any } },
) {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  let datecount = 0;
  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  const id = params.id;
  const approvedDates = await GetApprovedDates.execute({ reservationId: id });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  for (const approvedDate of approvedDates) {
    const startDateTime = moment
      .tz(
        `${approvedDate.startDate} ${approvedDate.startTime}`,
        "America/Denver",
      )
      .toISOString();

    const endDateTime = moment
      .tz(`${approvedDate.endDate} ${approvedDate.endTime}`, "America/Denver")
      .toISOString();

    const event = {
      summary: approvedDate.Reservation.eventName,

      description: approvedDate.Reservation.details,
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
      const response = await calendar.events.insert({
        calendarId: approvedDate.Reservation.Facility.googleCalendarId,
        requestBody: event,
      });
      datecount++;
    } catch (error) {
      return NextResponse.json({ message: "error" });
      console.error("Failed to create event: ", error);
    }
  }
  return NextResponse.json({
    status: 200,
    message: datecount + "google cal events created",
  });
}
