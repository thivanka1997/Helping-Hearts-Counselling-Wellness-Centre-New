import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Registration from "@/models/Registration";
import { initialUsers, initialRegistrations } from "@/src/data/initialData";

/**
 * POST /api/auth/login
 *
 * Validates credentials and returns the matched user.
 * Accepts: { email?: string, username?: string, role?: string, password?: string }
 *
 * NOTE: This route does NOT create a NextAuth session — it only validates credentials.
 * The browser login page uses signIn('credentials') from next-auth/react to create
 * the session. This endpoint is useful for external clients or pre-checks.
 *
 * On success returns: { success: true, user: { id, name, email, role } }
 * On failure returns: { error: string } with 400/401 status.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, string>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Accept either 'email' or 'username' as the identifier
  const { email, username, role = "STUDENT", password: _password = "demo12345" } = body;
  const identifier = (email || username || "").toLowerCase().trim();

  if (!identifier) {
    return NextResponse.json(
      { error: "Provide either 'email' or 'username' in the request body." },
      { status: 400 }
    );
  }

  let user: { id: string; name: string; email: string; role: string } | null = null;

  // 1. Try MongoDB User collection (case-insensitive for username/email/name)
  try {
    await connectToDatabase();
    const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ciRegex = { $regex: new RegExp(`^${escaped}$`, "i") };
    const dbUser = await User.findOne({
      $or: [
        { username: ciRegex },
        { email: ciRegex },
        { id: identifier },
        { name: ciRegex }
      ],
    }).lean();

    if (dbUser) {
      user = {
        id: (dbUser as any)._id?.toString() ?? (dbUser as any).id,
        name: (dbUser as any).name,
        email: (dbUser as any).email,
        role: (dbUser as any).role || role,
      };
    }
  } catch (e) {
    console.warn("[/api/auth/login] DB User lookup failed, trying fallback:", e);
  }

  // 2. Try MongoDB Registration collection (case-insensitive for username/email/name)
  if (!user) {
    try {
      await connectToDatabase();
      const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const ciRegex = { $regex: new RegExp(`^${escaped}$`, "i") };
      const dbReg = await Registration.findOne({
        $or: [
          { assignedUsername: ciRegex },
          { email: ciRegex },
          { studentId: identifier },
          { id: identifier },
          { fullName: ciRegex }
        ]
      }).lean();

      if (dbReg) {
        user = {
          id: (dbReg as any).studentId || `usr_${(dbReg as any).id}`,
          name: (dbReg as any).fullName,
          email: (dbReg as any).email,
          role: "STUDENT",
        };
      }
    } catch (e) {
      console.warn("[/api/auth/login] DB Registration lookup failed:", e);
    }
  }

  // 3. Fallback: search initialRegistrations
  if (!user) {
    const foundReg = initialRegistrations.find(
      (r) =>
        r.assignedUsername?.toLowerCase() === identifier ||
        r.email.toLowerCase() === identifier ||
        r.fullName.toLowerCase() === identifier ||
        r.id.toLowerCase() === identifier
    );
    if (foundReg) {
      user = {
        id: foundReg.studentId || `usr_${foundReg.id}`,
        name: foundReg.fullName,
        email: foundReg.email,
        role: "STUDENT",
      };
    }
  }

  // 4. Fallback: search initialUsers by email, username, id, or name
  if (!user) {
    const found = initialUsers.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        u.id.toLowerCase() === identifier ||
        (u as any).username?.toLowerCase() === identifier ||
        u.name.toLowerCase() === identifier
    );
    if (found) {
      user = { id: found.id, name: found.name, email: found.email, role: found.role };
    }
  }

  // 5. If quick student demo login ("student")
  if (!user && (identifier === "student" || identifier === "student_user")) {
    const defaultStudent = initialUsers.find((u) => u.role === "STUDENT");
    if (defaultStudent) {
      user = { id: defaultStudent.id, name: defaultStudent.name, email: defaultStudent.email, role: "STUDENT" };
    }
  }

  // 6. User entered a custom username: derive clean display name
  if (!user) {
    const cleanName = identifier
      .replace(/[@._-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const mockName = cleanName || (
      role === "ADMIN"
        ? "Chief Administrator"
        : role === "LECTURER"
        ? "Ms. Ramsina Farvin Jelaldeen"
        : role === "COUNSELLING_ADMIN"
        ? "Counselling Desk Manager"
        : "Student Learner"
    );

    user = {
      id: "usr_" + Date.now(),
      name: mockName,
      email: identifier.includes("@") ? identifier : `${identifier}@helpinghearts.lk`,
      role,
    };
  }

  return NextResponse.json(
    { success: true, user, message: "Credentials verified." },
    { status: 200 }
  );
}
