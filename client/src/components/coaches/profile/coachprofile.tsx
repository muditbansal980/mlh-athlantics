"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchCoachProfile } from '../../../../api/coaches/fetchcoachprofile';
import { mockCoachData } from './dummydata'; // Adjust path based on your project structure
import { Coach } from '@/types/coaches/coachprofiledata';
import { Edit2, View } from 'lucide-react';
import { CoachReviews } from './components/review';
import { SpecialitiesTabs } from './components/Specialties';
import { useRouter } from 'next/navigation';
import CoachSocialLinks from './components/socialLinks';
import { AdminOwnerauthorizationcheck } from '../../../../api/authorizationcheck/admin-ownercheck';
import { fetchUserData } from '../../../../api/user/getuserdata';
import { Contact } from '@/types/coaches/contact';
import { ViewButton } from './components/viewbutton';
export default function CoachProfile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(mockCoachData.followersCount);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');
  const [owner, setowner] = useState(false)
  const [coachData, setCoachData] = useState<Coach | null>(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [userData, setUserData] = useState<Coach | null>(null);
  const router = useRouter();
  const { coachId } = useParams();
  // console.log("coachId:", coachId);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, []);
  useEffect(() => {
    async function AuthorizationCheck() {
      if (userData) {
        const check = await AdminOwnerauthorizationcheck(String(coachId));
        // console.log("Authorization check result:", check?.allowed);
        setowner(check?.allowed);
      }
    }
    AuthorizationCheck()
  }, [userData])
  useEffect(() => {
    const getCoachData = async () => {
      try {
        const data = await fetchCoachProfile(String(coachId));
        setCoachData(data.profile);
        setSocialLinks(data.socialLinks);
        setSpecializations(data.specializations);
        setContacts(data.contacts);
      } catch (error) {
        console.error("Error fetching coach data:", error);
      }
    };

    getCoachData();
  }, []);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowers(prev => prev - 1);
    } else {
      setFollowers(prev => prev + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const handleChat = () => {
    alert(`Opening direct message channel with ${coachData?.CoachName || mockCoachData.name}...`);
  };

  const handleViewFollowers = () => {
    alert(`Displaying followers list modal (${followers.toLocaleString()} users)...`);
  };
  // console.log("coachspecializations:", specializations);
  // console.log("coachcontacts:", contacts);
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased pb-12">

      {/* 1. HERO BANNER AREA */}
      <div className="relative h-44 sm:h-64 w-full bg-neutral-200 overflow-hidden">
        <img
          src={coachData?.BannerUrl || mockCoachData.bannerImage}
          alt="Coach Banner"
          className="w-full h-full object-cover grayscale-[20%] contrast-[110%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {owner && (
          <div onClick={() => router.push(`/profile/coach/${coachId}/edit/banner`)} className="absolute top-3 right-3 cursor-pointer">
            <Edit2 className="absolute top-3 right-3 w-6 h-6 text-white cursor-pointer hover:text-red-600 transition-colors" />
          </div>
        )}
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 relative">

        {/* 2. PROFILE PHOTO */}
        <div className="relative -mt-16 sm:-mt-24 mb-4 flex justify-between items-end">
          <div className='relative h-28 w-28 sm:h-36 sm:w-36 rounded-full'>
            <div className=" border-4 rounded-full border-white bg-white overflow-hidden shadow-sm">
              <img
                src={coachData?.AvatarUrl || mockCoachData.profileImage}
                alt={coachData?.CoachName || mockCoachData.name}
                className="w-full h-full object-cover"
              />
            </div>
            {owner && (
              <div onClick={() => router.push(`/profile/coach/${coachId}/edit/avatar`)} className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-neutral-100 transition-colors">
                <Edit2 className="w-4 h-4 hover:text-red-600 transition-colors" />
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          {owner !== true && (

            <div className="flex gap-2 pb-1">
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${isFollowing
                  ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                  : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>

        {/* 3. HEADLINE INFO */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
            {coachData?.CoachName}
          </h1>
          <p className="text-sm sm:text-base font-medium text-neutral-600 leading-tight">
            {coachData?.Bio}
          </p>

          {/* LOCATION & METRICS */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs text-neutral-500">
            {coachData?.Location && (
              <span className="flex items-center gap-1">
                📍 {coachData?.Location}
              </span>
            )}
            {owner && (
              <span onClick={() => router.push(`/profile/coach/${coachId}/edit/Location`)} className="border-2 p-2 border-dashed rounded-lg border-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                Update Location
              </span>
            )}

            {/* <span>{new Date(String(coachData?.CreatedAt)).toLocaleString()}</span> */}
          </div>

          {/* FOLLOWERS / FOLLOWING SOCIAL METRICS */}
          <div className="flex items-center gap-4 pt-3 border-b border-neutral-200 pb-4">
            <button onClick={handleViewFollowers} className="text-sm text-left hover:opacity-80 transition-opacity">
              <span className="font-bold text-neutral-950">{coachData?.Followers || 0}</span>{' '}
              <span className="text-neutral-500">Followers</span>
            </button>
            {coachData?.View && (
              <span className="text-sm text-neutral-500">
                {coachData?.View}
              </span>
            )}
            {owner && (
              <div>
                <ViewButton coachId={String(coachId)} view={coachData?.View || "PRIVATE"} />
              </div>
            )}
          </div>
        </div>

        {/* 4. PRIMARY ACTIONS (CHAT & VIEW FOLLOWERS) */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <button
            onClick={handleChat}
            className="flex items-center justify-center gap-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm"
          >
            💬 Live Chat
          </button>
          <button
            onClick={handleViewFollowers}
            className="flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors shadow-sm"
          >
            👥 View Followers
          </button>
        </div>

        {/* 5. NAVIGATION TABS */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all ${activeTab === 'about'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
          >
            About & Specialties
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all ${activeTab === 'reviews'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
          >
            Reviews ({mockCoachData.reviews.length})
          </button>
        </div>

        {/* 6. DYNAMIC CONTENT SWITCH */}
        <div>
          {activeTab === 'about' ? (
            <div className="space-y-6">
              {/* Bio Section */}
              <div className=''>
                <div className='flex justify-between'>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-2">Biography</h3>
                  {owner && (
                    <Edit2 onClick={() => router.push(`/profile/coach/${coachId}/edit/Description`)} className="top-3 right-3 w-3 h-3 text-neutral-400 cursor-pointer hover:text-red-600 transition-colors" />
                  )}
                </div>
                <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                  {coachData?.Description}
                </p>
              </div>

              {/* Specialties Pill Tags */}
              <div className='flex'>
                <SpecialitiesTabs specialties={specializations} />
                {owner && (
                  <Edit2 onClick={() => router.push(`/profile/coach/${coachId}/edit/specializations`)} className="top-3 right-3 w-3 h-3 text-neutral-400 cursor-pointer hover:text-red-600 transition-colors" />
                )}
              </div>
              {/* NEW: DEDICATED CONTACT SECTION */}
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-3">Contact Information</h3>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-sm">

                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <div key={contact.Id} className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{contact.Label}</p>
                          <p className="text-sm text-neutral-500">{contact.Value}</p>
                        </div>
                        {owner && (
                          <Edit2 onClick={() => router.push(`/profile/coach/${coachId}/edit/contact/`)} className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-red-600 transition-colors" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">No contact information available.</p>
                  )}
                </div>
                {owner && (
                  <button onClick={() => router.push(`/profile/coach/${coachId}/edit/contact`)} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                    Add Contact Info
                  </button>
                )}
              </div>


              {/* Social Links Section */}
              <CoachSocialLinks allowed={owner} socialLinks={socialLinks} coachId={String(coachId)} />
            </div>
          ) : (
            /* 7. REVIEWS SECTION */
            <CoachReviews reviews={mockCoachData.reviews} />
          )}
        </div>
      </div>
    </div>
  );
}