import NextAuth from "@/lib/auth";

// Export named handlers
export const GET = async (req, res) => {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("NextAuth GET error:", error);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
    });
  }
};

export const POST = async (req, res) => {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error("NextAuth POST error:", error);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
    });
  }
};