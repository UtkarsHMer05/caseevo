import Link from "next/link"; // Helps create navigable links within the Next.js app
import MaxWidthWrapper from "./MaxWidthWrapper"; // Wrapper to keep content within a max width
import { buttonVariants } from "./ui/button"; // Generates button classNames for styling
import { ArrowRight } from "lucide-react"; // Icon used for a right arrow
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"; // Gets user session

const Navbar = async () => {
  // Extract 'getUser' from the session
  const { getUser } = getKindeServerSession();
  // Fetch the current user object
  const user = await getUser();

  // Check if current user has an email matching the admin email in environment variables
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  return (
    // A navigational bar with some styling
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        {/* Container for navbar items */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          {/* Logo linking back to the home page */}
          <Link href="/" className="flex z-40 font-semibold">
            case<span className="text-blue-600">Evo</span>
          </Link>

          {/* Right side of the navbar */}
          <div className="h-full flex items-center space-x-4">
            {/* Conditionally render links if user is logged in or not */}
            {user ? (
              <>
                {/* Logout link */}
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign Out
                </Link>
                {/* If user is admin, show Dashboard link */}
                {isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                ) : null}
                {/* Button to create new phone case */}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Case 📱
                  <ArrowRight className=" ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                {/* Registration link if user not logged in */}
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Sign Up
                </Link>
                {/* Login link if user not logged in */}
                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Login 🚀
                </Link>
                {/* Divider line only on larger screens */}
                <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
                {/* Button to create new phone case */}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Case 📱
                  <ArrowRight className=" ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
