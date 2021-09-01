/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    LinearProgress
} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';

import React, { useEffect, useState } from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import './Rooms.scss';
import { AccessTime, Add, Settings } from '@material-ui/icons';
import FloatingButton from '../../shared/components/floating-button/floating-button';
import RoomDialog from './components/room-dialog/RoomDialog';
import { Room } from '../../types/Room';
import { RoomDetails } from '../../types/RoomDetails';
import ErrorDialog from './../../shared/components/error-dialog/ErrorDialog';
import ApiError, { isApiError } from './../../types/ApiError';
import { Link } from 'react-router-dom';

const Rooms: React.FC = () => {
    const [pageSize, setPageSize] = useState(2);
    const [page, setPage] = useState(0);

    const {
        data: rooms = { totalCount: 0, values: [] },
        isLoading: areRoomsLoading,
        isFetching,
        error: getRoomsError
    } = { isLoading: false, data: { values: [], totalCount: 0 }, isFetching: false, error: undefined };

    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [openAddNewRoomDialog, setOpenAddNewRoomDialog] = useState(false);
    const [openEditRoomDialog, setOpenEditRoomDialog] = useState(false);
    const [roomToEdit, setRoomToEdit] = useState<Room>(undefined);
    const [apiError, setApiError] = useState<ApiError>();

    const [
        addRoom,
        {
            isLoading: isAddNewRoomLoading,
            error: addNewRoomError
        }
    ] = [{addRoom: ({id: number}) => { return; } }, { isLoading: false, error: undefined }];
    const [editRoom, { isLoading: isEditRoomLoading, error: editRoomError }] = [{addRoom: ({id: number}) => { return; } }, { isLoading: false, error: undefined }];
    const [deleteRoom, { isLoading: isDeleteRoomLoading, error: deleteRoomError }] = [{deleteRoom: ({id: number}) => { return; } }, { isLoading: false, error: undefined }];

    useEffect(() => {
        if (getRoomsError
            || addNewRoomError
            || editRoomError
            || deleteRoomError) {
            const error = getRoomsError ?? addNewRoomError ?? editRoomError ?? deleteRoomError;
            if (error) {
                if (isApiError(error)) {
                    setApiError(error);
                }
                else {
                    setApiError({ data: { message: undefined } });
                }
                setOpenErrorDialog(true);
                setOpenAddNewRoomDialog(false);
                setOpenEditRoomDialog(false);
            }
        }
    }, [getRoomsError, addNewRoomError, editRoomError, deleteRoomError,])

    const [isAnyQueryLoading, setIsAnyQueryLoading] = useState<boolean>();
    useEffect(() => {
        const isLoading = areRoomsLoading || isFetching || isDeleteRoomLoading;
        setIsAnyQueryLoading(isLoading);
    }, [
        areRoomsLoading,
        isFetching,
        isDeleteRoomLoading,
    ]);


    const handleCloseErrorDialogClicked = () => { setOpenErrorDialog(false) }
    const handleAddNewRoom = () => { setOpenAddNewRoomDialog(true); }
    const handleOnCancelNewRoomDialog = () => { setOpenAddNewRoomDialog(false); }
    const handleOnSaveNewRoomDialog = (newRoomDetails: RoomDetails) => {
        return;
    };

    const handleChangePage = (event: unknown, newPage: number) => { setPage(newPage); }
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setPageSize(parseInt(event.target.value)); }

    const handleEditClicked = (room: Room) => {
        console.log(isEditRoomLoading);
        setRoomToEdit(room);
        setOpenEditRoomDialog(true);
    }
    const handleOnCancelEditRoom = () => {
        setRoomToEdit(undefined);
        setOpenEditRoomDialog(false);
    }
    const handleOnSaveEditRoom = (roomDetails: RoomDetails) => {
        return;
    }

    const handleDeleteRoom = (roomId: number) => {
        return;
    }

    return (
        <>
            {
                apiError ?
                    <ErrorDialog open={openErrorDialog} handleClose={handleCloseErrorDialogClicked} errorMessage={apiError.data.message} />
                    :
                    <>
                        {
                            isAnyQueryLoading ?
                                <LinearProgress style={{width: '100%'}}/>
                                :
                                <>
                                    <FloatingButton onClick={handleAddNewRoom} icon={Add} text="Add new room" />
                                    <RoomDialog
                                        open={openAddNewRoomDialog}
                                        onCancel={handleOnCancelNewRoomDialog}
                                        onSave={handleOnSaveNewRoomDialog}
                                        isLoading={isAddNewRoomLoading}
                                        roomDitails={{ description: "Room description..." }}
                                        dialogTitle="Add new room"
                                    />
                                    <RoomDialog
                                        open={openEditRoomDialog}
                                        onCancel={handleOnCancelEditRoom}
                                        onSave={handleOnSaveEditRoom}
                                        isLoading={isEditRoomLoading}
                                        roomDitails={{ ...roomToEdit }}
                                        dialogTitle="Edit room"
                                    />
                                    <Grid container
                                        direction="column"
                                        justifyContent="flex-start"
                                        className="rooms-table-container"
                                    >
                                        <Grid item>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <colgroup>
                                                        <col width="5%" />
                                                        <col width="80%" />
                                                        <col width="5%" />
                                                        <col width="5%" />
                                                        <col width="5%" />
                                                    </colgroup>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className="rooms-table-cell">Id</TableCell>
                                                            <TableCell className="rooms-table-cell">Description</TableCell>
                                                            <TableCell className="rooms-table-cell" align="center">Bookings</TableCell>
                                                            <TableCell className="rooms-table-cell" align="center">Edit</TableCell>
                                                            <TableCell className="rooms-table-cell" align="center">Delete</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            rooms.values.map((room) => (
                                                                <TableRow key={room.id} className="romms-table-row">
                                                                    <TableCell>{room.id}</TableCell>
                                                                    <TableCell>{room.description}</TableCell>
                                                                    <TableCell align="center">
                                                                        <Link to={`rooms/${room.id}/reservations`}>
                                                                            <IconButton>
                                                                                <AccessTime />
                                                                            </IconButton>
                                                                        </Link>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <IconButton onClick={() => handleEditClicked(room)}>
                                                                            <Settings />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <IconButton onClick={() => handleDeleteRoom(room.id)}>
                                                                            <RemoveCircleOutlineIcon />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item>
                                            <Grid container justifyContent="flex-end">
                                                <Grid item>
                                                    <TablePagination
                                                        rowsPerPageOptions={[2, 3]}
                                                        component="div"
                                                        count={rooms.totalCount}
                                                        rowsPerPage={pageSize}
                                                        page={page}
                                                        onPageChange={handleChangePage}
                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                        }
                    </>
            }
        </>
    );
}

export default Rooms;