import { useState, useCallback } from 'react';
import { useTour } from '../contexts/TourContext';
import { useAuth } from '../contexts/AuthContext';

export const useVirtualTour = (tourId) => {
  const { tours, updateTour } = useTour();
  const { currentUser } = useAuth();
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  const tour = tours.find(t => t.id === tourId);
  const rooms = tour?.rooms || [];
  const currentRoom = rooms[currentRoomIndex];

  const canEditTour = useCallback(() => {
    return currentUser && tour && tour.createdBy === currentUser.uid;
  }, [currentUser, tour]);

  const addRoom = useCallback(async (roomData) => {
    if (!canEditTour()) return;

    const updatedRooms = [...rooms, { ...roomData, id: Date.now().toString() }];
    
    try {
      await updateTour(tourId, { rooms: updatedRooms });
    } catch (error) {
      console.error('Error adding room:', error);
      throw error;
    }
  }, [tourId, rooms, updateTour, canEditTour]);

  const deleteRoom = useCallback(async (roomId) => {
    if (!canEditTour()) return;

    const updatedRooms = rooms.filter(room => room.id !== roomId);
    
    try {
      await updateTour(tourId, { rooms: updatedRooms });
      
      // Adjust current room index if necessary
      if (currentRoomIndex >= updatedRooms.length) {
        setCurrentRoomIndex(Math.max(0, updatedRooms.length - 1));
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }, [tourId, rooms, currentRoomIndex, updateTour, canEditTour]);

  const switchRoom = useCallback((roomIndex) => {
    if (roomIndex >= 0 && roomIndex < rooms.length) {
      setCurrentRoomIndex(roomIndex);
    }
  }, [rooms.length]);

  const nextRoom = useCallback(() => {
    if (currentRoomIndex < rooms.length - 1) {
      setCurrentRoomIndex(currentRoomIndex + 1);
    }
  }, [currentRoomIndex, rooms.length]);

  const previousRoom = useCallback(() => {
    if (currentRoomIndex > 0) {
      setCurrentRoomIndex(currentRoomIndex - 1);
    }
  }, [currentRoomIndex]);

  const updateRoom = useCallback(async (roomId, roomData) => {
    if (!canEditTour()) return;

    const updatedRooms = rooms.map(room => 
      room.id === roomId ? { ...room, ...roomData } : room
    );
    
    try {
      await updateTour(tourId, { rooms: updatedRooms });
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }, [tourId, rooms, updateTour, canEditTour]);

  return {
    tour,
    rooms,
    currentRoom,
    currentRoomIndex,
    canEditTour: canEditTour(),
    addRoom,
    deleteRoom,
    updateRoom,
    switchRoom,
    nextRoom,
    previousRoom,
    hasNextRoom: currentRoomIndex < rooms.length - 1,
    hasPreviousRoom: currentRoomIndex > 0
  };
};
