import React from 'react';
import { Button, Typography } from '../../atoms';
import translate from 'translations';
import { ProfileCirclesBox } from '../profileCirclesBox';
import { useGrooming, useSocket } from 'contexts';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import classNames from 'classnames';

interface IProps {
  visible: boolean;
}

export const StickyGroomingBottomBox = ({ visible }: IProps) => {
  const {
    participants,
    startGrooming,
    setIsGameStarted,
    isGameStarted,
    groomingData,
    currentTaskNumber,
    tasks,
    taskResult,
    setViewOnlyMode,
    viewOnlyMode
  } = useGrooming();
  const currentTask = tasks[currentTaskNumber];
  const socket = useSocket();
  const isShowButtonDisabled = taskResult.currentTaskNumber === currentTaskNumber;

  if (!visible) {
    return null;
  }

  const handleGroomingStart = () => {
    startGrooming().then(() => {
      setIsGameStarted(true);
      socket?.emit('startGame', { groomingId: groomingData._id, isGameStarted: true });
    });
  };

  const handleShowTaskResult = () => {
    socket?.emit('calculateTaskResult', {
      groomingId: groomingData._id,
      metrics: groomingData.metrics,
      currentTaskNumber,
      taskId: currentTask.detail._id,
    });
  };

  const handleViewMode = () => {
    setViewOnlyMode(!viewOnlyMode);
  }

  return (
    <>
      <div className="fixed bottom-0 bg-white w-full shadow-2xl lg:pr-72 z-10">
        <div className="p-7 h-20 flex justify-between items-center lg:justify-end lg:gap-x-5">
          <div className="flex items-center gap-x-5">
            <button
              className={classNames('border rounded-lg px-3 py-2 flex items-center gap-x-3', {
                'border-lightgray': !viewOnlyMode,
                'hover:bg-extralightgray': !viewOnlyMode,
                'border-green': viewOnlyMode,
                'hover:bg-lightgreen': viewOnlyMode,
                'hover:text-white': viewOnlyMode,
                'text-green': viewOnlyMode,
                'text-gray': !viewOnlyMode
              })}
              onClick={handleViewMode}
            >
              <Typography element="p" size="base" className="sm: hidden lg:block">
                {!viewOnlyMode ? translate('VIEW_ONLY_MODE') : translate("VOTER_MODE")}
              </Typography>
              {!viewOnlyMode ? <IconEyeOff /> : <IconEye /> }
            </button>
            <ProfileCirclesBox badgeMembers={participants} totalMembersNumber={participants.length} />
          </div>
          {!isGameStarted ? (
            <Button variant="primary" className="px-10 py-3" onClick={handleGroomingStart}>
              {translate('START')}
            </Button>
          ) : (
            <Button
              variant="primary"
              className={`px-10 py-3 ${isShowButtonDisabled ? 'opacity-25' : ''}`}
              onClick={handleShowTaskResult}
              disabled={isShowButtonDisabled}
            >
              {translate('SHOW')}
            </Button>
          )}
        </div>
      </div>
      <div className="h-20 mt-5"></div>
    </>
  );
};
