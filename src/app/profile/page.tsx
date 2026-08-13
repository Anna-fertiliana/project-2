"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Send } from "lucide-react";

import type { Post } from "@/types/post";


interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
}


interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}


interface ProfileResponse {
  data?: {
    profile?: UserProfile;
    stats?: ProfileStats;
  };
}


interface PostsResponse {
  data?: {
    items?: Post[];
  };
}


interface ApiResponse {
  data?: {
    items?: Post[];
  };
}


export default function ProfilePage() {

  const [user, setUser] =
    useState<UserProfile | null>(null);


  const [stats, setStats] =
    useState<ProfileStats | null>(null);


  const [posts, setPosts] =
    useState<Post[]>([]);


  const [savedPosts, setSavedPosts] =
    useState<Post[]>([]);


  const [activeTab, setActiveTab] =
    useState<"gallery" | "saved">(
      "gallery"
    );


  const [loading, setLoading] =
    useState(true);


  const [loadingPosts, setLoadingPosts] =
    useState(true);


  const [showToast, setShowToast] =
    useState(false);



  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://be-social-media-api-production.up.railway.app";



  const fetcher = async <T,>(
    url: string
  ): Promise<T | null> => {

    try {

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;


      const response =
        await fetch(
          `${baseUrl}${url}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );


      if (!response.ok) {
        throw new Error(
          "Fetch failed"
        );
      }


      return await response.json() as T;


    } catch (error) {

      console.error(
        "FETCH ERROR:",
        error
      );

      return null;
    }
  };



  useEffect(() => {

    const load = async () => {

      try {

        const [
          profile,
          myPosts,
          saved,
        ] =
          await Promise.all([
            fetcher<ProfileResponse>(
              "/api/me"
            ),

            fetcher<PostsResponse>(
              "/api/me/posts"
            ),

            fetcher<ApiResponse>(
              "/api/me/saved"
            ),
          ]);



        setUser(
          profile?.data?.profile ??
          null
        );


        setStats(
          profile?.data?.stats ??
          null
        );


        setPosts(
          myPosts?.data?.items ??
          []
        );


        setSavedPosts(
          saved?.data?.items ??
          []
        );


      } catch(error){

        console.error(error);

      } finally {

        setLoading(false);
        setLoadingPosts(false);

      }

    };


    void load();


  }, []);




  useEffect(() => {

    if (
      typeof window === "undefined"
    ) return;


    const params =
      new URLSearchParams(
        window.location.search
      );


    if(
      params.get("updated") === "true"
    ){

      setShowToast(true);


      const timer =
        setTimeout(
          () =>
            setShowToast(false),
          3000
        );


      return () =>
        clearTimeout(timer);
    }


  }, []);




  const handleShare =
    async (): Promise<void> => {


      if(!user) return;


      const url =
        `${window.location.origin}/users/${user.username}`;


      try {


        if(
          navigator.share
        ){

          await navigator.share({
            url,
          });


        } else {


          await navigator.clipboard.writeText(
            url
          );


          alert(
            "Link copied!"
          );

        }


      } catch {

        alert(
          "Failed to share"
        );

      }

  };



  if(loading){

    return (
      <div className="text-white text-center py-10">
        Loading...
      </div>
    );

  }



  if(!user){

    return (
      <div className="text-white text-center py-10">
        Failed to load profile
      </div>
    );

  }



  const currentPosts =
    activeTab === "gallery"
      ? posts
      : savedPosts;



  return (

    <main className="text-white pb-24">


      {
        showToast && (

          <div
            className="
              fixed top-20 right-4
              bg-green-600
              px-4 py-2
              rounded-lg
              text-sm
              z-50
            "
          >
            Profile updated
          </div>

        )
      }



      <div className="max-w-2xl mx-auto">



        {/* HEADER */}

        <div className="px-4 pt-6">

          <div className="flex items-start justify-between">


            <div className="flex items-center gap-4">

              <img
                src={
                  user.avatarUrl ||
                  "/avatar.png"
                }
                alt="Profile"
                className="
                  w-14 h-14
                  rounded-full
                  object-cover
                  border border-zinc-700
                "
              />


              <div>

                <p className="font-semibold text-sm">
                  {user.name}
                </p>


                <p className="text-xs text-gray-400">
                  @{user.username}
                </p>


              </div>


            </div>




            <div className="flex items-center gap-2">


              <Link href="/edit">

                <button
                  type="button"
                  className="
                    px-3 py-1
                    text-xs
                    rounded-full
                    border border-zinc-700
                  "
                >
                  Edit Profile
                </button>


              </Link>



              <button
                type="button"
                onClick={handleShare}
                className="
                  text-zinc-400
                  hover:text-white
                "
              >

                <Send size={20}/>

              </button>


            </div>


          </div>




          <p className="text-xs text-gray-300 mt-3">
            {user.bio || "No bio yet"}
          </p>


        </div>





        {/* STATS */}

        <div className="mt-6 flex justify-between text-center px-4">


          <div className="flex-1">

            <p className="font-semibold text-sm">
              {stats?.posts ?? posts.length}
            </p>

            <p className="text-xs text-gray-400">
              Post
            </p>

          </div>



          <div className="w-px bg-zinc-800"/>



          <Link
            href={`/users/${user.username}/followers`}
            className="flex-1"
          >

            <p className="font-semibold text-sm">
              {stats?.followers ?? 0}
            </p>


            <p className="text-xs text-gray-400">
              Followers
            </p>


          </Link>



          <div className="w-px bg-zinc-800"/>



          <Link
            href={`/users/${user.username}/following`}
            className="flex-1"
          >

            <p className="font-semibold text-sm">
              {stats?.following ?? 0}
            </p>


            <p className="text-xs text-gray-400">
              Following
            </p>


          </Link>



          <div className="w-px bg-zinc-800"/>



          <div className="flex-1">

            <p className="font-semibold text-sm">
              {stats?.likes ?? 0}
            </p>


            <p className="text-xs text-gray-400">
              Likes
            </p>


          </div>


        </div>





        {/* TAB */}

        <div className="
          mt-6
          border-b border-zinc-800
          flex justify-center
          gap-12
          text-xs
        ">


          <button
            type="button"
            onClick={() =>
              setActiveTab("gallery")
            }
            className={`
              pb-3
              ${
                activeTab === "gallery"
                ? "border-b-2 border-white"
                : "text-gray-400"
              }
            `}
          >

            ▦ Gallery

          </button>



          <button
            type="button"
            onClick={() =>
              setActiveTab("saved")
            }
            className={`
              pb-3 flex items-center gap-2
              ${
                activeTab === "saved"
                ? "border-b-2 border-white"
                : "text-gray-400"
              }
            `}
          >

            <Bookmark size={14}/>
            Saved

          </button>


        </div>





        {/* POSTS */}

        <div className="mt-2">


          {
            loadingPosts && (

              <p className="
                text-center
                text-gray-400
                py-10
              ">
                Loading...
              </p>

            )
          }




          {
            !loadingPosts &&
            currentPosts.length === 0 && (

              <p className="
                text-center
                text-gray-400
                py-10
              ">
                {
                  activeTab === "gallery"
                  ? "No posts"
                  : "No saved posts"
                }
              </p>

            )
          }





          {
            !loadingPosts &&
            currentPosts.length > 0 && (

              <div className="
                grid
                grid-cols-3
                gap-[2px]
              ">

                {
                  currentPosts.map(
                    (post)=> (

                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                    >

                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="
                          aspect-square
                          object-cover
                        "
                      />

                    </Link>

                  ))
                }

              </div>

            )
          }


        </div>


      </div>


    </main>

  );

}