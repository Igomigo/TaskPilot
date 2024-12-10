import React, { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { PiDotsThreeVertical } from "react-icons/pi";
import { Link, useNavigate, useNavigation, useParams } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';

// Dummy board data
const initialLists = [
  {
    id: '1',
    title: 'To Do',
    cards: [
      { id: '1', content: 'Research market trends' },
      { id: '2', content: 'Create project proposal' },
      { id: '3', content: 'Analyze competitor strategies' },
      { id: '4', content: 'Define target audience' },
      { id: '5', content: 'Outline project timeline' },
      { id: '6', content: 'Estimate budget requirements' },
      { id: '7', content: 'Identify potential risks' },
      { id: '8', content: 'Draft initial project plan' },
      { id: '9', content: 'Design user interface' },
      { id: '10', content: 'Develop backend API' },
      { id: '11', content: 'Implement authentication' },
      { id: '12', content: 'Set up CI/CD pipeline' },
    ]
  },
  {
    id: '2',
    title: 'In Progress',
    cards: [
      { id: '9', content: 'Design user interface' },
      { id: '10', content: 'Develop backend API' },
      { id: '11', content: 'Implement authentication' },
      { id: '12', content: 'Set up CI/CD pipeline' },
    ]
  },
  {
    id: '3',
    title: 'Done',
    cards: [
      { id: '13', content: 'Project kickoff meeting' },
      { id: '14', content: 'Define project scope' },
      { id: '10', content: 'Develop backend API' },
      { id: '11', content: 'Implement authentication' },
      { id: '12', content: 'Set up CI/CD pipeline' },
    ]
  }
]

const BoardName = "Software planing and all of that"

const BoardPage = () => {
  // Hooks
  const { boardId } = useParams();
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State Management
  const [boardData, setBoardData] = useState({});
  const [lists, setLists] = useState([]);
  const [showList, setShowList] = useState(false);
  const [newList, setNewList] = useState({
    title: "",
    position: 0
  });
  const [newCard, setNewCard] = useState();
  const [loading, setLoading] = useState(false);

  // Handle on change event for a new list
  const handleOnchangeForNewList = (e) => {
    const title = e.target.value;
    setNewList({
      ...newList,
      title: title
    });
  }

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}/list`;

    if (newList.title === "") {
      return;
    }

    const listData = {
      ...newList,
      position: lists.length + 1
    }

    const token = user?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(listData),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token is invalid or expired, redirect to login
        toast.error("Session expired, redirecting to login");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("An error occured");
      }

      const data = await response.json();
      console.log(data);
      setLists(prev => [
        ...prev,
        data
      ]);

      setNewList("");
      setShowList(false);

    } catch (error) {
      console.log("Error:", error.message);

    } finally {
      setLoading(false);
    }
  }

  // Fetch board data
  const fetchBoardData = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}`;

    const token = user?.token;

    if (!token) {
      console.warn("No token available; redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token is invalid or expired, redirect to login
        toast.error("Session expired, redirecting to login");
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("An Unknown error occured");
      }

      const boardData = await response.json();
      //console.log(boardData);
      setBoardData(boardData);
      setLists(boardData.lists);

    } catch (error) {
      console.log("Error", error.message);
    }
  }

  // Fetch the board data on page load
  useEffect(() => {
    if (user?.token) {
      fetchBoardData();
    } else {
      console.warn("User token not available yet");
    }
  }, [user]);

  return (
    <div className='h-screen overflow-hidden'>
      <div className='flex shadow-lg justify-between p-6 text-sm border-gray-800 border-b h-10 px-4 items-center'>
        <h2 className='text-lg text-gray-200 font-bold mr-4 text-ellipsis line-clamp-1'>{BoardName}</h2>
        <button className='text-gray-300 hover:text-white'>
          <PiDotsThreeOutlineVerticalFill size={18} />
        </button>
      </div>
      <div className='flex px-4 py-4 overflow-x-auto scroll overflow-y-hidden h-[calc(100vh-105px)]'>
        {
          lists?.length > 0 ? (
            lists.map(list => (
              <div key={list._id} className='w-72 h-fit max-h-[calc(100vh-150px)] rounded-lg pb-3 flex-shrink-0 mr-4 flex flex-col bg-form-bg'>
                <div className='flex justify-between items-center px-3 py-4'>
                  <h2 className='text-gray-200 font-semibold'>{list?.title}</h2>
                  <button className='text-white'>
                    <PiDotsThreeVertical size={25}/>
                  </button>
                </div>
                {/** Display all cards for each list */}
                <div className='scroll overflow-y-auto flex-grow'>
                  {
                    list?.cards?.length > 0 ? (
                      list?.cards?.map(card => (
                        <Link key={card?._id} to={`/b/${list?._id}/${card?.title}`} className='group'>
                          <div className='bg-bg-color group-hover:border text-gray-300 shadow rounded-lg p-3 mb-2 mx-2'>
                            <p className='text-sm'>{card?.title}</p>
                          </div>
                        </Link>
                      ))
                    ) : ("")
                  }
                </div>
                <div className='flex-shrink-0 px-2 py-2'>
                  <button className='text-white flex space-x-1 justify-center items-center px-2 py-1 rounded-md hover:bg-gray-600'>
                    <FaPlus size={15}/>
                    <p className='text-sm'>Add a card</p>
                  </button>
                </div>
              </div>
            ))
          ) : ("")
        }
        {
          showList && (
            <form onSubmit={handleSubmit} className='w-fit flex-shrink-0 h-fit mr-4'>
              <input
                type='text'
                name='title'
                onChange={handleOnchangeForNewList}
                className='px-4 py-3 text-white focus:outline-none bg-input-bg rounded-lg'
              />
              <div className='flex items-center mt-2'>
                <button type="submit" className="text-sm mr-3 bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg text-white">
                  {
                    loading ? "Saving..." : "Save"
                  }
                </button>
                <button onClick={() => setShowList(false)} className='text-sm text-gray-300 hover:border-white hover:text-white border border-gray-500 px-3 py-1 rounded-lg'>
                  Cancel
                </button>
              </div>
            </form>
          )
        }
        {
          lists.length > 0 ? (
            <div className='flex-shrink-0 w-72 h-fit'>
              <button onClick={() => setShowList(true)} className='flex justify-center space-x-2 items-center rounded-lg px-4 py-2 font-semibold w-full text-white bg-blue-700 hover:bg-blue-800'>
                <FaPlus size={15}/>
                <p className='text-sm'>Add another list</p>
              </button>
            </div>
          ) : (
            <div className='flex-shrink-0 w-72 h-fit'>
              <button onClick={() => setShowList(true)} className='flex justify-center space-x-2 items-center rounded-lg px-4 py-2 font-semibold w-full text-white bg-blue-700 hover:bg-blue-800'>
                <FaPlus size={15}/>
                <p className='text-sm'>Create a list</p>
              </button>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default BoardPage;
