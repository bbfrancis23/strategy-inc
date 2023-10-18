
import { useContext } from "react";

import { Box, IconButton, Paper, TextField } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import { useSnackbar } from "notistack";

import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup"
import axios from "axios";

import { Item } from "@/react/item/item-types";
import { Column } from "@/react/column/column-types";
import { Member } from "@/react/Member/member-types";
import { ProjectContext } from "@/interfaces/ProjectInterface";
import { BoardContext } from "@/react/board/BoardContext";

export interface EditItemFormProps{
  column: Column;
  member: Member;
  item: Item;
  closeForm: () => void;
}

const editItemSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
})

const projectsPath = "/api/members/projects"

const EditItemForm = (props: EditItemFormProps) => {

  const { column, item, closeForm} = props;

  const {enqueueSnackbar} = useSnackbar()

  const {project} = useContext(ProjectContext)
  const {board, setBoard} = useContext(BoardContext)


  const formik = useFormik({
    initialValues: { title: item.title },
    validationSchema: editItemSchema,
    onSubmit: (data) => {

      axios.patch(
        `${projectsPath}/${project.id}/boards/${board.id}/columns/${column.id}/items/${item.id}`,
        {title: data.title},
      )
        .then((res) => {
          formik.setSubmitting(false)
          if (res.status === axios.HttpStatusCode.Ok ){
            setBoard(res.data.board)

            enqueueSnackbar("Item updated", {variant: "success"})
            formik.resetForm()
            closeForm();
          }
        })
        .catch((error) => {

          formik.setSubmitting(false)
          enqueueSnackbar(error.message, {variant: "error"})
        })
    }
  })

  const handleCloseForm = () => {
    formik.resetForm();
    closeForm()
  }

  const {errors, touched, handleSubmit, getFieldProps, isSubmitting, isValid} = formik


  return (

    <Paper >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box sx={{ ml: 1, display: 'flex'}}>
            <TextField size={'small'} label="Edit Title" {...getFieldProps('title')}
              error={Boolean(touched && errors.title)} helperText={touched && errors.title}
              sx={{width: 140}}
            />
            <Box>
              <IconButton color="success" disabled={!(isValid && formik.dirty)}
                type="submit"
                sx={{ml: 1, }} >
                <DoneIcon />
              </IconButton>
              <IconButton onClick={() => handleCloseForm()}>
                <CloseIcon />
              </IconButton>
            </Box>
          </ Box>
        </Form>
      </FormikProvider>
    </Paper>
  )


}

export default EditItemForm

// QA: Brian Francisc 8-12-23