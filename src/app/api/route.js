import { NextResponse } from "next/server";

export async function GET(req) {

  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const from = searchParams.get("from") || `${new Date().getFullYear()}-01-01T00:00:00Z`;
    const to = searchParams.get("to") || `${new Date().getFullYear()}-12-31T23:59:59Z`;

    if (!username) {

      return NextResponse.json(
        { error: "username is required" },
        { status: 400 }
      );
    }

    const query = `
           query($username: String!, $from: DateTime!, $to: DateTime!) {
               user(login: $username) {
                   contributionsCollection(from: $from, to: $to) {
                       contributionCalendar {
                           totalContributions
                           weeks {
                               contributionDays {
                                   contributionCount
                                   date
                                   color
                               }
                           }
                       }
                   }
               }
           }
       `;

    const response = await fetch(`${process.env.GITHUB_GRAPHQL_API}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
        variables: {
          username,
          from,
          to,
        },
      }),

      cache: "no-store",
    }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {

    return NextResponse.json(
      {
        error: "Failed to fetch GitHub contributions",
      },
      { status: 500 }
    );
  }
}