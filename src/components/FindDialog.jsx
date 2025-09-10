import { X } from "lucide-react";
import { useUIStore } from "../store/store.js";
import { userdata } from "./constants/userdata.js";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { server } from "../constants/config.js";

const FindDialog = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const currentRequestRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Clear users if query is empty
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      fetchData(searchQuery.trim());
    }, 500); // 500ms debounce delay

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  async function fetchData(query) {
    if (!query) return;

    // Cancel previous request if it exists
    if (currentRequestRef.current) {
      currentRequestRef.current.cancel("New search initiated");
    }

    try {
      setIsLoading(true);
      
      // Create cancel token for this request
      const cancelToken = axios.CancelToken.source();
      currentRequestRef.current = cancelToken;

      const { data } = await axios.get(
        `${server}/api/v1/chats/findUser?q=${encodeURIComponent(query)}`,
        { 
          withCredentials: true,
          cancelToken: cancelToken.token
        }
      );
      
      setUsers(data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request cancelled:", err.message);
      } else {
        console.log("Error fetching users:", err);
        setUsers([]);
      }
    } finally {
      setIsLoading(false);
      currentRequestRef.current = null;
    }
  }

  async function handleInvite(userId) {
    try {
      const response = await axios.post(
        `${server}/api/v1/users/sendfriendrequest?q=${userId}`, 
        {},
        { withCredentials: true }
      );
      console.log("send request data :: ", response);
      
      // Remove the invited user from the list
      setUsers(prev => prev.filter(user => user._id !== userId));
      
    } catch (err) {
      console.log("Error sending request users:", err);
    }
  }

  const setIsSearchPeopleClicked = useUIStore((state) => state.setIsSearchPeopleClicked);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (currentRequestRef.current) {
        currentRequestRef.current.cancel("Component unmounting");
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#3B3B3B] w-full max-w-md rounded-lg shadow-lg px-12 py-8 pb-10 relative">
        <X 
          onClick={setIsSearchPeopleClicked} 
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 cursor-pointer" 
          size={20} 
          strokeWidth={3} 
          color="#c1c1c1" 
        />
        <h2 className="text-xl font-semibold mb-6 text-center">
          Find People On <span className="font-bold text-[#248F60]">SynqChat</span>
        </h2>

        <div className="flex flex-col gap-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Enter Username or Email"
              className="w-full rounded border border-gray-300 px-3 py-1 outline-none"
            />
          </form>

          {isLoading && (
            <div className="text-center text-gray-400">Searching...</div>
          )}

          {!isLoading && searchQuery.trim() && (
            <>
              {users.length > 0 ? (
                <div className="flex flex-col gap-3 pl-2 max-h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
                  {users.map(({ avatar, username, _id, fullName }) => (
                    <div key={_id} className="items-center flex justify-between pr-4">
                      <div className="flex gap-2 items-center">
                        <img 
                          src={avatar?.url || avatar || '/image.png'} 
                          className="h-8 w-8 rounded-full border-[2px] border-[#248F60] object-cover" 
                          alt={`${username} avatar`}
                        />
                        <div className="flex flex-col">
                          <span className="line-clamp-1 font-semibold">{username}</span>
                          {fullName && (
                            <span className="line-clamp-1 text-xs text-gray-400">{fullName}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleInvite(_id)} 
                        className="px-3 h-6 rounded-md text-xs bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition"
                      >
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No users found</p>
              )}
            </>
          )}

          {!searchQuery.trim() && (
            <p className="text-center text-gray-400">Start typing to search for users</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDialog;