"use client";

import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

interface CurrentUser {
  username: string;
  avatarUrl?: string | null;
}

interface SearchUser {
  id: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
}

interface SearchResponse {
  data?: {
    users?: SearchUser[];
  };
}

export default function Navbar() {

  const router =
    useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://be-social-media-api-production.up.railway.app";

  const [
    user,
    setUser,
  ] = useState<CurrentUser | null>(null);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState<SearchUser[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // GET USER

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("user");
      if(savedUser){
        const parsedUser =
          JSON.parse(savedUser) as CurrentUser;
        setUser(parsedUser);
      }
    } catch(error){
      console.error(
        "USER PARSE ERROR:",
        error
      );
    }
  }, []);

  // CLOSE DROPDOWN

  useEffect(() => {
    const handleClickOutside =
      (event: MouseEvent): void => {

        if(
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target as Node
          )
        ){
          setOpen(false);
        }
      };
    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // SEARCH

  useEffect(() => {

    if(!query.trim()){
      setResults([]);
      return;
    }

    const delay =
      setTimeout(
        async () => {
          try {
            setLoading(true);
            const response =
              await fetch(
                `${API_URL}/api/users/search?q=${encodeURIComponent(query)}`
              );

            const data =
              await response.json() as SearchResponse;
            const users =
              data.data?.users ?? [];
            setResults(
              Array.isArray(users)
                ? users
                : []
            );
          } catch(error){
            console.error(
              "SEARCH ERROR:",
              error
            );
            setResults([]);
          } finally {
            setLoading(false);
          }
        },
        400
      );
    return () =>
      clearTimeout(delay);
  }, [query, API_URL]);


  // LOGOUT

  const logout =
    (): void => {
      localStorage.removeItem(
        "user"
      );
      localStorage.removeItem(
        "token"
      );
      window.location.href =
        "/login";
    };

  return (
    <nav className="
      fixed
      top-0
      left-0
      w-full
      z-50
      border-b
      border-zinc-800
      bg-black/70
      backdrop-blur-md
      px-4
      py-3
    ">

      <div className="
        max-w-6xl
        mx-auto
        flex
        items-center
        justify-between
        gap-4
      ">

        {/* LOGO */}

        <Link
          href="/"
          className="
            flex
            items-center
            gap-2
          "
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="
              w-6
              h-6
            "
          />

          <span className="
            text-white
            font-semibold
            text-lg
          ">
            Sociality
          </span>
        </Link>


        {/* SEARCH */}

        <div className="
          flex-1
          max-w-md
          relative
        ">

          <FiSearch
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-zinc-500
            "
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search"
            className="
              w-full
              bg-zinc-900
              border
              border-zinc-800
              pl-10
              pr-3
              py-2
              rounded-full
              text-sm
              text-white
              outline-none
              focus:ring-1
              focus:ring-purple-500
            "
          />
          {
            query && (
              <div className="
                absolute
                top-12
                w-full
                bg-zinc-900
                border
                border-zinc-800
                rounded-xl
                shadow-lg
                max-h-64
                overflow-y-auto
                z-50
              ">

                {
                  loading && (
                    <p className="
                      text-xs
                      text-gray-400
                      p-3
                    ">
                      Searching...
                    </p>
                  )
                }

                {
                  !loading &&
                  results.length === 0 && (
                    <p className="
                      text-xs
                      text-gray-400
                      p-3
                    ">
                      No users found
                    </p>
                  )
                }
                {
                  results.map(
                    (searchUser) => (
                      <div
                        key={
                          searchUser.id
                        }
                        onClick={() => {
                          router.push(
                            `/users/${searchUser.username}`
                          );
                          setQuery("");
                          setResults([]);
                        }}
                        className="
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2
                          hover:bg-zinc-800
                          cursor-pointer
                        "
                      >
                        <img
                          src={
                            searchUser.avatarUrl ||
                            "/avatar.png"
                          }
                          alt="Avatar"
                          onError={(
                            event: React.SyntheticEvent<
                              HTMLImageElement
                            >
                          ) => {

                            event.currentTarget.src =
                              "/avatar.png";
                          }}
                          className="
                            w-8
                            h-8
                            rounded-full
                            object-cover
                          "
                        />

                        <div>
                         <p className="
                            text-sm
                            text-white
                          ">
                            {
                              searchUser.username
                            }
                          </p>

                          <p className="
                            text-xs
                            text-gray-400
                          ">
                            {
                              searchUser.name ||
                              "User"
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )
                }
              </div>
            )
          }

        </div>

        {/* RIGHT */}

        <div className="
          flex
          items-center
          gap-3
        ">
          {
            user ? (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpen(
                      (prev) => !prev
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span className="
                    hidden
                    md:block
                    text-sm
                    text-zinc-300
                  ">
                    {user.username}
                  </span>

                  <img
                    src={
                      user.avatarUrl ||
                      "/avatar.png"
                    }
                    alt="Avatar"
                    onError={(
                      event: React.SyntheticEvent<
                        HTMLImageElement
                      >
                    ) => {

                      event.currentTarget.src =
                        "/avatar.png";
                    }}
                    className="
                      w-9
                      h-9
                      rounded-full
                      object-cover
                      border
                      border-zinc-700
                    "
                  />
                </button>

                {
                  open && (
                    <div className="
                      absolute
                      right-0
                      mt-2
                      w-44
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded-xl
                      shadow-lg
                      overflow-hidden
                    ">
                      <Link
                        href="/profile"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="
                          block
                          px-4
                          py-2
                          text-sm
                          hover:bg-zinc-800
                        "
                      >
                        Profile
                      </Link>

                      <button
                        type="button"
                        onClick={logout}
                        className="
                          w-full
                          text-left
                          px-4
                          py-2
                          text-sm
                          text-red-400
                          hover:bg-zinc-800
                        "
                      >
                        Logout
                      </button>
                    </div>
                  )
                }
              </div>
            ) : (
              <div className="
                flex
                items-center
                gap-3
              ">
                <Link
                  href="/login"
                  className="
                    text-sm
                    text-zinc-300
                    hover:text-white
                  "
                >
                  Login
                </Link>

                <Link

                  href="/register"

                  className="
                    text-sm
                    bg-white
                    text-black
                    px-3
                    py-1.5
                    rounded-full
                    font-medium
                    hover:bg-gray-200
                    transition
                  "

                >
                  Register
                </Link>
              </div>
            )
          }
        </div>
      </div>
    </nav>
  );
}