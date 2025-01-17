import React, { useEffect, useState } from 'react';
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { PiDotsThreeVertical } from "react-icons/pi";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import useLogout from '../hooks/useLogout';
import { useRef } from 'react';
import { MdGroups, MdDeleteSweep, MdClose } from "react-icons/md";
import { IoMdArchive } from "react-icons/io";
import io from "socket.io-client";
import { LuClock4 } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { format } from 'date-fns';
import { setSocketConnection } from '../redux/userSlice';
import Loading from '../components/loading';

// Dummy board data
// const initialLists = [
//   {
//     id: '1',
//     title: 'To Do',
//     cards: [
//       { id: '1', content: 'Research market trends' },
//       { id: '2', content: 'Create project proposal' },
//       { id: '3', content: 'Analyze competitor strategies' },
//       { id: '4', content: 'Define target audience' },
//       { id: '5', content: 'Outline project timeline' },
//       { id: '6', content: 'Estimate budget requirements' },
//       { id: '7', content: 'Identify potential risks' },
//       { id: '8', content: 'Draft initial project plan' },
//       { id: '9', content: 'Design user interface' },
//       { id: '10', content: 'Develop backend API' },
//       { id: '11', content: 'Implement authentication' },
//       { id: '12', content: 'Set up CI/CD pipeline' },
//     ]
//   },
//   {
//     id: '2',
//     title: 'In Progress',
//     cards: [
//       { id: '9', content: 'Design user interface' },
//       { id: '10', content: 'Develop backend API' },
//       { id: '11', content: 'Implement authentication' },
//       { id: '12', content: 'Set up CI/CD pipeline' },
//     ]
//   },
//   {
//     id: '3',
//     title: 'Done',
//     cards: [
//       { id: '13', content: 'Project kickoff meeting' },
//       { id: '14', content: 'Define project scope' },
//       { id: '10', content: 'Develop backend API' },
//       { id: '11', content: 'Implement authentication' },
//       { id: '12', content: 'Set up CI/CD pipeline' },
//     ]
//   }
// ]

const BoardPage = () => {
  // Hooks
  const { boardId } = useParams();
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activityModalRef = useRef(null);
  const handleLogout = useLogout();

  // State Management
  const [boardData, setBoardData] = useState({});
  const [lists, setLists] = useState([]);
  const [showList, setShowList] = useState(false);
  const [showCardInputs, setShowCardInputs] = useState({});
  const [newList, setNewList] = useState({
    title: "",
    position: 0
  });
  const [newCard, setNewCard] = useState();
  const [listLoading, setlistLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
  const [deleteBoardLoading, setDeleteBoardLoading] = useState(false);

  // Handle on change event for a new list
  const handleOnchangeForNewList = (e) => {
    const title = e.target.value;
    setNewList({
      ...newList,
      title: title
    });
  }

  // Handle Submit Form for a new list
  const handleSubmitList = async (e) => {
    e.preventDefault();

    setlistLoading(true);
    //const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}/list`;

    if (newList.title === "") {
      return;
    }

    const listData = {
      ...newList,
      position: lists.length + 1,
      boardId: boardId,
    }

    const socketConnection = user?.socketConnection;

    // Emit the new list event
    socketConnection.emit("newList", listData);
    // Clear the input field
    e.target.reset();
    // Reset the newList state
    setNewList({title: "", position: 0});
    // Close the show list modal
    setShowList(false);

    // const token = user?.token;

    // if (!token) {
    //   navigate("/login");
    //   return;
    // }

    // setlistLoading(true);

    // try {
    //   const response = await fetch(url, {
    //     method: "POST",
    //     body: JSON.stringify(listData),
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Authorization": `Bearer ${token}`
    //     }
    //   });

    //   if (response.status === 401) {
    //     // Token is invalid or expired, redirect to login
    //     toast.error("Session expired, redirecting to login");
    //     handleLogout();
    //   }

    //   if (!response.ok) {
    //     throw new Error("An error occured");
    //   }

    //   const data = await response.json();
    //   //console.log(data);
    //   setLists(prev => [
    //     ...prev,
    //     data
    //   ]);

    //   setNewList("");
    //   setShowList(false);

    // } catch (error) {
    //   console.log("Error:", error.message);

    // } finally {
    //   setlistLoading(false);
    // }
  }

  // Toggle between card states
  const toggleCardInputState = (listId) => {
    setShowCardInputs(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  }

  // Handle submit card
  const handleSubmitCard = async (e, listId) => {
    e.preventDefault();

    setCardLoading(true);

    const cardTitle = e.target.cardTitle.value;

    const newCard = {
      title: cardTitle,
      boardId: boardId,
      listId: listId
    };

    const socketConnection = user?.socketConnection;

    if (socketConnection && newCard.listId && newCard.title && newCard.boardId) {
      socketConnection.emit("newCard", newCard);
      // Clear the input field
      e.target.reset();
      setCardLoading(false);
      // Hide the card input form
      toggleCardInputState(listId);
    }

    // if (cardTitle.trim()) {
    //   const url = `${import.meta.env.VITE_BACKEND_URL}/b/${listId}/card`;

    //   const token = user?.token;

    //   if (!token) {
    //     console.warn("No token available; redirecting to login.");
    //     navigate("/login");
    //     return;
    //   }

    //  setCardLoading(true);

      // try {
      //   const response = await fetch(url, {
      //     method: "POST",
      //     body: JSON.stringify({title: cardTitle, boardId: boardId}),
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Authorization": `Bearer ${token}`
      //     }
      //   });

      //   if (response.status === 401) {
      //     // Token is invalid or expired, redirect to login
      //     toast.error("Session expired, redirecting to login");
      //     handleLogout();
      //   }

      //   if (response.status === 409) {
      //     toast.error("Card already exists in this list");
      //     setShowCardInputs(false);
      //   }

      //   if (!response.ok) {
      //     throw new Error("An error occured");
      //   }

      //   const newCard = await response.json();

      //   // Update the respective list's card array with the new card
      //   setLists(prev => 
      //     prev.map(list => 
      //       list._id === listId ? {...list, cards: [...list.cards, newCard]} : list
      //     )
      //   );

      //   e.target.reset();
      //   toggleCardInputState(listId);

      // } catch (error) {
      //   console.log("Error:", error.message);

      // } finally {
      //   setCardLoading(false);
      // }
    //}
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

    setPageLoading(true);

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
        handleLogout();
      }

      if (response.status === 403) {
        toast.error("You are not a member of this board, sneaky you...");
        navigate("/");
      }

      if (!response.ok) {
        throw new Error("An Unknown error occured");
      }

      const boardData = await response.json();
      //console.log(boardData);
      setBoardData(boardData);
      setLists(
        boardData.lists.map(list => {
          const updatedCards = list.cards.map((card) => {
            if (card.dueDate) {
              return {
                ...card,
                dueDate: format(new Date(card.dueDate), 'MMM dd, yyyy')
              };
            }
            return card;
          });
          return {...list, cards: updatedCards}
        })
      );

      console.log("All Lists:", lists);

    } catch (error) {
      console.log("Error", error.message);

    } finally {
      setPageLoading(false);
    }
  }

  // handle Delete Modal Open
  const handleDeleteModalOpen = () => {
    setShowDeleteBoardModal(true);
    setShowActivityModal(false);
  }

  // Delete board functionality
  const deleteBoard = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/b/${boardId}`;

    setDeleteBoardLoading(true);

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        if (response.status === 403) {
            toast.error("You don't have permission to delete this board");
            return;
        }

        if (response.status === 404) {
            toast.error("Board not found");
            return;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error deleting board");
        }

        const result = await response.json();

        if (result.message) {
            toast.success("Board deleted successfully");
            navigate("/");
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error(error.message);
    } finally {
        setDeleteBoardLoading(false);
    }
  }

  // Fetch the board data on page load
  useEffect(() => {
    if (user?.token) {
      fetchBoardData();
    } else {
      console.warn("User token not available yet");
    }
  }, [user, navigate, boardId]);

  // Close activitymodal when user clicks anywhere on the screen
  useEffect(() => {
    function handleClickOutside(event) {
        if (activityModalRef.current && !activityModalRef.current.contains(event.target)) {
            setShowActivityModal(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Establish socket connection
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token")
      }
    });

    if (socketConnection) {
      dispatch(setSocketConnection(socketConnection));
    }

    //console.log("Socket connection:", socketConnection);

    // Listen for the auth error event
    socketConnection.on("Auth_error", data => {
      toast.error("Session expired, kindly log in again");
      handleLogout();
    });

    // Emit the join board event
    socketConnection.emit("joinBoard", boardId);

    // Listen for the overdue cards event and update the UI
    socketConnection.on("overdueCards", overdueCards => {
      setLists(prev => {
        const updatedLists = [...prev];

        overdueCards.forEach(overdueCard => {
          const listIndex = updatedLists.findIndex(list =>
            list.cards.some(card => card._id === overdueCard._id)
          );

          if (listIndex != -1) {
            const cardIndex = updatedLists[listIndex].cards.findIndex(card =>
              card._id === overdueCard._id
            );

            if (cardIndex != -1) {
              const existingCard = updatedLists[listIndex].cards[cardIndex];

              // Format the existing card's dueDate
              if (existingCard.dueDate) {
                existingCard.dueDate = format(new Date(existingCard.dueDate), 'MMM dd, yyyy');
              }

              // Update the card with data from the server
              updatedLists[listIndex].cards[cardIndex] = {
                ...existingCard,
                ...overdueCard
              };
            }
          }
        });

        return updatedLists;
      });
    });

    socketConnection.on("createdList", newList => {
      if (newList) {
        setLists(prev => {
          // Check is list already exists
          const listExists = prev.some((list) => list._id === newList._id);
          if (!listExists) {
            return [...prev, newList]
          }
          return prev;
        });
      }
    });

    // Listen for the newCard event and update the UI
    socketConnection.on("cardCreated", newCard => {
      console.log("New card event received successfully:", newCard);
      // Update the respective list's card array with the new card
        setLists(prev => 
        prev.map(list => 
          list._id === newCard?.listId 
            ? {...list, cards: list.cards.some(card => card._id === newCard._id) 
                ? list.cards 
                : [...list.cards, newCard]
              } 
            : list
        )
      );
    });

    // Listen for the card already exists event
    socketConnection.on("alreadyExists", message => {
      console.log("Already exists event triggered");
      toast.error(message);
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socketConnection.off("cardCreated");
      socketConnection.off("createdList");
      socketConnection.off("overdueCards");
      socketConnection.off("alreadyExists");
      socketConnection.off("Auth_error");
      socketConnection.emit("leaveBoard", boardId);
      socketConnection.disconnect();
    };

  }, [boardId, dispatch]);

  if (pageLoading) return <div className='h-full flex items-center justify-center'><Loading /></div>

  return (
    <div className='h-screen overflow-hidden'>
      <div ref={activityModalRef} className='flex shadow-lg relative justify-between p-6 text-sm border-gray-800 border-b h-10 px-4 items-center'>
        <h2 className='text-lg text-gray-200 font-bold mr-4 text-ellipsis line-clamp-1'>{boardData.title}</h2>
        <button onClick={() => setShowActivityModal(prev => !prev)} className='text-gray-300 p-2 rounded-lg hover:text-white focus:bg-input-bg hover:bg-input-bg'>
          <PiDotsThreeOutlineVerticalFill size={18} />
        </button>
        {
          showActivityModal && (
            <div className='absolute text-sm border border-slate-700 right-0 mr-6 top-0 px-2 py-4 w-fit mt-11 rounded-md bg-form-bg h-fit text-white'>
              <Link to={`/b/${boardId}/members`} className='flex w-full items-center hover:bg-input-bg hover:text-white rounded-md text-gray-300 px-3 py-2 text-sm'>
                <MdGroups className='mr-3' size={23}/>
                <button>Board members</button>
              </Link>
              <button className='flex w-full items-center hover:bg-input-bg hover:text-white rounded-md text-gray-300 px-3 py-2 text-sm'>
                <IoMdArchive className='mr-3' size={23}/>
                <button>Archive this board</button>
              </button>
              <button onClick={handleDeleteModalOpen} className='flex w-full items-center hover:bg-input-bg hover:text-white rounded-md text-gray-300 px-3 py-2 text-sm'>
                <MdDeleteSweep className='mr-3' size={23}/>
                <button>Delete this board</button>
              </button>
            </div>
          )
        }
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
                        <Link key={card._id} to={`/b/${list?._id}/${card?.title}`} className='group'>
                          <div className='bg-bg-color text-gray-300 shadow rounded-lg p-3 mb-2 mx-2 border border-transparent transition-colors duration-200 ease-in-out group-hover:border-gray-200'>
                            <p className='text-sm'>{card?.title}</p>
                            <div className='flex space-x-2 items-center'>
                              {
                                card.dueDate ? (
                                  card.status === "overdue" ? (
                                    <div title='Overdue' className='flex space-x-1 px-2 py-1 rounded-md bg-red-400 w-fit mt-2 text-black'>
                                        <LuClock4 size={15}/>
                                        <span className='text-xs'>{card.dueDate}</span>
                                      </div>
                                  ) : (
                                      <div title='Deadline date' className='flex space-x-1 px-2 py-1 rounded-md bg-green w-fit mt-2 text-black'>
                                        <LuClock4 size={15}/>
                                        <span className='text-xs'>{card.dueDate}</span>
                                      </div>
                                    )
                                ) : ""
                              }
                              {
                                card.status === "completed" && (
                                  <div title='completed' className='bg-blue-700 p-1 mt-2 rounded-md'>
                                    <FaCheck size={15}/>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className='text-gray-400 text-sm p-3'>No cards in this list</div>
                    )
                  }
                </div>
                <div className='flex-shrink-0 px-2 py-2'>
                  {
                    showCardInputs[list._id] ? (
                      <form onSubmit={(e) => handleSubmitCard(e, list._id)} className='w-full h-fit'>
                        <input
                          type='text'
                          name='cardTitle'
                          className='w-full text-white px-3 py-2 focus:outline-none text-sm bg-input-bg rounded-lg '
                          placeholder='Card title...'
                        />
                        <div className='flex mt-2'>
                          <button type='submit' className='text-sm mr-2 bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg text-white'>
                            {cardLoading ? "Saving..." : "Save"}
                          </button>
                          <button type="button" onClick={() => toggleCardInputState(list._id)} className='text-sm text-gray-300 hover:border-white hover:text-white border border-gray-500 px-3 py-1 rounded-lg'>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <button onClick={() => toggleCardInputState(list._id)} className='text-white flex space-x-1 justify-center items-center px-2 py-1 rounded-md hover:bg-gray-600'>
                        <FaPlus size={15}/>
                        <p className='text-sm'>Add a card</p>
                      </button>
                    )
                  }
                </div>
              </div>
            ))
          ) : ("")
        }
        {
          showList && (
            <form onSubmit={handleSubmitList} className='w-fit flex-shrink-0 h-fit mr-4'>
              <input
                type='text'
                name='title'
                onChange={handleOnchangeForNewList}
                className='px-4 font-semibold py-3 text-white focus:outline-none bg-input-bg rounded-lg'
                placeholder='List title...'
              />
              <div className='flex items-center mt-2'>
                <button type="submit" className="text-sm mr-2 bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg text-white">
                  {
                    listLoading ? "Saving..." : "Save"
                  }
                </button>
                <button type="button" onClick={() => setShowList(false)} className='text-sm text-gray-300 hover:border-white hover:text-white border border-gray-500 px-3 py-1 rounded-lg'>
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
      {
        showDeleteBoardModal && (
          <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center'>
            <div className='relative w-full mx-4 max-w-md bg-input-bg rounded-md'>
              <button onClick={() => setShowDeleteBoardModal(false)} aria-label="Close modal" className='absolute top-2 right-2 text-white'>
                <MdClose size={20} />
              </button>
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-white'>Delete Board</h3>
                <p className='mt-4 text-gray-200'>Are you sure you want to delete this board? This action cannot be undone.</p>
                <div className='flex space-x-4 justify-end mt-6'>
                  <button onClick={() => setShowDeleteBoardModal(false)} className='font-medium rounded-md ring-2 ring-blue-600 hover:ring-blue-500 px-3 py-1 text-white'>Cancel</button>
                  <button onClick={deleteBoard} className='font-medium bg-red-500 hover:bg-red-600 rounded-md px-3 py-1 text-white'>
                    {
                      deleteBoardLoading ? ("Deleting...") : ("Delete")
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default BoardPage;
