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
import { LuClock4 } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { format } from 'date-fns';
import { logout } from '../redux/userSlice';
import Loading from '../components/loading';

const BoardPage = () => {
  // Hooks
  const { boardId } = useParams();
  const user = useSelector(state => state?.user);
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
  const [listLoading, setlistLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
  const [deleteBoardLoading, setDeleteBoardLoading] = useState(false);
  const [showListActions, setShowListActions] = useState({});
  const [showDeleteListModal, setShowDeleteListModal] = useState(false);
  const [deleteListLoading, setDeleteListLoading] = useState(false);
  const [currentListToBeDeleted, setCurrentListToBeDeleted] = useState({});

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
  }

  // Toggle between card states
  const toggleCardInputState = (listId) => {
    setShowCardInputs(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  }

  // Toggle list actions state
  const toggleListActionsState = (listId) => {
    setShowListActions(prev => ({
      ...prev,
      [listId]: !prev[listId]
    }));
  }

  // Toggle delete list modal state and set the current list to be deleted
  const toggleDeleteListModal = (list) => {
    setCurrentListToBeDeleted(list);
    setShowDeleteListModal(prev => !prev);
  }

  // Handle delete list
  const deleteList = async () => {
    const listId = currentListToBeDeleted._id;
    const url = `${import.meta.env.VITE_BACKEND_URL}/l/${listId}/delete-list`;
    
    setDeleteListLoading(true);

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
        const result = await response.json();
        toast.error(result.message);
        return;
      }

      if (!response.ok) {
        const result = await response.json();
        console.log(result);
        throw new Error("Error while deleting list");
      }

      const deletedListData = await response.json();

      console.log("Deleted list:", deletedListData);

      // Update the list array to remove the deleted list from the UI
      setLists(prevLists => 
        prevLists.filter(list => list._id !== deletedListData.list?._id)
      );

      setShowDeleteListModal(false);
      toast.success("List deleted successfully");

    } catch (error) {
      console.error("Error:", error);

    } finally {
      setDeleteListLoading(false);
    }
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

  // Socket events
  useEffect(() => {
    const socketConnection = user?.socketConnection;
    if (socketConnection) {
      // Emit the join board event
      socketConnection.emit("joinBoard", boardId);

      socketConnection.on("overdueCards", handleOverdueCards);
      socketConnection.on("createdList", handleCreatedList);
      socketConnection.on("cardCreated", handleCardCreated);
      socketConnection.on("alreadyExists", handleAlreadyExists);

      return () => {
        socketConnection.off("overdueCards", handleOverdueCards)
        socketConnection.off("createdList", handleCreatedList)
        socketConnection.off("cardCreated", handleCardCreated)
        socketConnection.off("alreadyExists", handleAlreadyExists)
      }
    }

  }, [user?.socketConnection, boardId]);

  // Socket event handlers
  const handleOverdueCards = (overdueCards) => {
    console.log("Overdue card found");
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
  };

  const handleCreatedList = (newList) => {
    if (newList) {
      setLists(prev => {
        // Check is list already exists
        const listExists = prev.some((list) => list._id === newList._id);
        if (!listExists) {
          return [...prev, newList]
        }
        return prev;
      });

      // Reset the newList state
      setNewList({title: "", position: 0});
      // Close the show list modal
      setShowList(false);
    }
  };

  const handleCardCreated = (newCard) => {
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

    setCardLoading(false);
    // Hide the card input form
    toggleCardInputState(newCard?.listId);
  }

  const handleAlreadyExists = (message) => {
    console.log("Already exists event triggered");
    toast.error(message);
  }

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
            <div className='absolute text-sm border border-slate-700 z-40 right-0 mr-6 top-0 px-2 py-4 w-fit mt-11 rounded-md bg-form-bg h-fit text-white'>
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
                  <div className='relative'>
                    <button onClick={() => toggleListActionsState(list._id)} className='group text-white'>
                      <PiDotsThreeVertical className='group-hover:text-white group-hover:bg-gray-500 group-hover:rounded-lg' size={25}/>
                    </button>
                    {
                      showListActions[list._id] && (
                        <div className='absolute flex flex-col p-2 text-sm w-fit right-0 whitespace-nowrap bg-form-bg border border-gray-500 rounded-md text-white'>
                          <button onClick={() => toggleDeleteListModal(list)} className='flex space-x-2 items-center justify-center hover:bg-input-bg px-3 py-2 rounded-md'>
                            <MdDeleteSweep size={18} />
                            <p>Delete this list</p>
                          </button>
                          <button className='flex space-x-2 items-center justify-center hover:bg-input-bg px-3 py-2 rounded-md'>
                            <IoMdArchive />
                            <p>Archive this list</p>
                          </button>
                        </div>
                      )
                    }
                  </div>
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
      {
        showDeleteListModal && (
          <div className='fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center'>
            <div className='relative w-full mx-4 max-w-md bg-input-bg rounded-md'>
              <button onClick={() => setShowDeleteListModal(false)} aria-label="Close modal" className='absolute top-2 right-2 text-white'>
                <MdClose size={20} />
              </button>
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-white'>Delete the <span className='font-bold text-blue-600'>{currentListToBeDeleted?.title}</span> list</h3>
                <p className='mt-4 text-gray-200'>Are you sure you want to delete this list? This action cannot be undone.</p>
                <div className='flex space-x-4 justify-end mt-6'>
                  <button onClick={() => setShowDeleteListModal(false)} className='font-medium rounded-md ring-2 ring-blue-600 hover:ring-blue-500 px-3 py-1 text-white'>Cancel</button>
                  <button onClick={deleteList} className='font-medium bg-red-500 hover:bg-red-600 rounded-md px-3 py-1 text-white'>
                    {
                      deleteListLoading ? ("Deleting...") : ("Delete")
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
