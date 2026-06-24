export async function onRequestGet(context: any) {
  const { env } = context;
  const ZONE_ID = env.CF_ZONE_ID;
  const API_TOKEN = env.CF_RADAR_TOKEN;

  if (!ZONE_ID || !API_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing Cloudflare credentials in environment variables." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const CLOUDFLARE_GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';
  
  const currentDate = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(currentDate.getDate() - 31);
  const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0];

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  };

  try {
    const dailyResponse = await fetch(CLOUDFLARE_GRAPHQL_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: `
            query GetDailyStats($zoneId: String!, $since: ISO8601DateTime!, $host: String!) {
              viewer {
                zones(filter: { zoneTag: $zoneId }) {
                  totals: httpRequests1dGroups(
                    filter: { date_gt: $since, clientRequestHTTPHost: $host },
                    limit: 30
                  ) {
                    uniq { uniques }
                    sum { requests bytes }
                  }
                  httpRequests1dGroups(
                    filter: { date_gt: $since, clientRequestHTTPHost: $host },
                    limit: 30,
                    orderBy: [date_ASC]
                  ) {
                    dimensions { date }
                    uniq { uniques }
                    sum { pageViews requests }
                  }
                }
              }
            }
          `,
        variables: {
          zoneId: ZONE_ID,
          since: formattedThirtyDaysAgo,
          host: "dav.one",
        },
      }),
    });

    if (!dailyResponse.ok) {
      return new Response(JSON.stringify({ error: `HTTP error! Daily: ${dailyResponse.status}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await dailyResponse.json();

    if (!data.data || data.errors) {
      return new Response(JSON.stringify({ error: data.errors ? `GraphQL Error: ${data.errors[0]?.message}` : 'No data returned from API' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const zoneData = data.data.viewer.zones[0];
    const totalUniques = zoneData.totals[0]?.uniq?.uniques || 0;
    const totalRequests = zoneData.totals[0]?.sum?.requests || 0;
    const totalBytes = zoneData.totals[0]?.sum?.bytes || 0;
    
    const dailyData = zoneData.httpRequests1dGroups.map((day: any) => {
      return {
        date: day.dimensions.date,
        pageViews: day.sum.pageViews,
        requests: day.sum.requests,
        uniques: day.uniq.uniques,
      };
    });

    const stats = { dailyData, totalUniques, totalRequests, totalBytes };

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400', // Cache in browser for 24 hours
        'CDN-Cache-Control': 'max-age=86400' // Cache at Cloudflare edge for 24 hours
      }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
