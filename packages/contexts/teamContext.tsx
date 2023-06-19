import React, { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';
import { useApp } from './appContext';

type TeamContextValuesType = {
  team: TeamData;
  setTeam: (value: TeamData) => void;
  editTeamTask: (title: string, description: string) => void;
  selectTeamTaskToEdit: EditTaskPayload;
  setSelectTeamTaskToEdit: (value: EditTaskPayload) => void;
  tasks: Task[];
  showEditTeamTaskModal: boolean;
  setShowEditTeamTaskModal: (value: boolean) => void;
  getTeamTasks: (value: string) => void;
  deleteTeamTask: () => void;
  showEditTeamModal: boolean;
  setShowEditTeamModal: (value: boolean) => void;
  selectTeamToEdit: EditTeamPayload;
  setSelectTeamToEdit: (value: EditTeamPayload) => void;
  editTeam: (value: string) => void;
  deleteTeam: () => void;
  getTeam: () => void;
};

interface TeamData {
  _id: string;
  name: string;
  members: UserData[];
  tasks: Task[];
  games: string[];
  createdAt: string;
  updatedAt: string;
  badgeMembers: UserData[];
  totalMembers: number;
}

interface UserData {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  teams: TeamData[];
  profileCircleBackgroundColor: string;
  profileCircleTextColor: string;
  profileCircleText: string;
}

interface Task {
  description: string;
  gameId: string;
  teamId: string;
  metrics: { maxPoint: number; minPoint: number; name: string; _id: string }[];
  score: number;
  title: string;
  _id: string;
  storyPoint: number;
}

interface EditTaskPayload {
  _id: string;
  title: string;
  description: string;
  teamId: string;
}

interface EditTeamPayload {
  _id: string;
  name: string;
}

const TeamContext = createContext({} as TeamContextValuesType);

export const TeamContextProvider: React.FC<{ children: ReactNode; data: TeamData }> = ({ children, data }) => {
  const [team, setTeam] = useState(data);
  const [tasks, setTasks] = useState(data.tasks);
  const [selectTeamTaskToEdit, setSelectTeamTaskToEdit] = useState({} as EditTaskPayload);
  const [showEditTeamTaskModal, setShowEditTeamTaskModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [selectTeamToEdit, setSelectTeamToEdit] = useState({} as EditTeamPayload);
  const { setShowLoader } = useApp();

  const getTeamTasks = useCallback(
    async (teamId: string) => {
      try {
        const res = await axios.get(`/api/teams/${teamId}/tasks`);
        setTasks(res.data.tasks);
      } catch (err) {
        setShowLoader(false);
      }
    },
    [setShowLoader]
  );

  const editTeamTask = useCallback(
    async (title: string, description: string) => {
      try {
        await axios.patch(`/api/tasks/${selectTeamTaskToEdit._id}`, {
          title,
          description,
        });
      } catch (err) {
        setShowLoader(false);
      }
    },
    [selectTeamTaskToEdit, setShowLoader]
  );

  const deleteTeamTask = useCallback(async () => {
    try {
      await axios.delete(`/api/tasks/${selectTeamTaskToEdit._id}`);
    } catch (err) {
      setShowLoader(false);
    }
  }, [selectTeamTaskToEdit, setShowLoader]);

  const editTeam = useCallback(
    async (name: string) => {
      try {
        await axios.patch(`/api/teams/${team._id}`, {
          name,
        });
      } catch (err) {
        setShowLoader(false);
      }
    },
    [team, setShowLoader]
  );

  const deleteTeam = useCallback(async () => {
    try {
      await axios.delete(`/api/teams/${team._id}`);
    } catch (err) {
      setShowLoader(false);
    }
  }, [team, setShowLoader]);

  const getTeam = useCallback(async () => {
    try {
      const res = await axios.get(`/api/teams/${team._id}`, {});
      setTeam(res.data.team);
    } catch (err) {
      setShowLoader(false);
    }
  }, [team, setShowLoader]);

  const values = useMemo(
    () => ({
      team,
      setTeam,
      editTeamTask,
      selectTeamTaskToEdit,
      setSelectTeamTaskToEdit,
      tasks,
      showEditTeamTaskModal,
      setShowEditTeamTaskModal,
      getTeamTasks,
      deleteTeamTask,
      showEditTeamModal,
      setShowEditTeamModal,
      deleteTeam,
      editTeam,
      selectTeamToEdit,
      setSelectTeamToEdit,
      getTeam,
    }),
    [
      team,
      setTeam,
      editTeamTask,
      selectTeamTaskToEdit,
      setSelectTeamTaskToEdit,
      tasks,
      showEditTeamTaskModal,
      setShowEditTeamTaskModal,
      deleteTeamTask,
      showEditTeamModal,
      setShowEditTeamModal,
      deleteTeam,
      editTeam,
      selectTeamToEdit,
      setSelectTeamToEdit,
      getTeam,
      getTeamTasks,
    ]
  );
  return <TeamContext.Provider value={values}>{children}</TeamContext.Provider>;
};

export const useTeam = () => useContext(TeamContext);
