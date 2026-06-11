import axios from "axios";
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

        const response = await axios.post(
            process.env.GITHUB_GRAPHQL_API,
            {
                query,
                variables: {
                    username,
                    from,
                    to,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("GitHub GraphQL Error:", error.response?.data || error.message);

        return NextResponse.json(
            {
                error: "Failed to fetch GitHub contributions",
                details: error.response?.data || error.message,
            },
            { status: 500 }
        );
    }
}