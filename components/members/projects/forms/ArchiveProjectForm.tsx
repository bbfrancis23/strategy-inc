
import { useContext } from "react";
import { ProjectContext } from "@/interfaces/ProjectInterface";
import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import axios from "axios";
import router from "next/router";
import Permission, { PermissionCodes } from "@/ui/permission/Permission";
import { Member } from "@/interfaces/MemberInterface";

export type ArchiveProjectFormProps = {
  member: Member
}

const ArchiveProjectForm = (props: ArchiveProjectFormProps) => {
  const {member} = props

  const {project} = useContext(ProjectContext)

  const {enqueueSnackbar} = useSnackbar()

  const confirm = useConfirm()

  const handleArchive = async () => {
    try{
      await confirm({description: `Archive ${project.title}`})
        .then( () => {
          axios.delete(`/api/projects/${project.id}`).then((res) => {
            enqueueSnackbar(`Archived ${project.title}`, {variant: "success"})
            router.push("/member")
          }).catch((error) => {
            enqueueSnackbar(`Error Archiving Project: ${error.response.data.message}`,
              {variant: "error"})
          })
        })
        .catch((e) => enqueueSnackbar('Archiving aborted', {variant: "error"}) )
    }catch(e){ enqueueSnackbar(`Error2  Archiving ${e}`, {variant: "error"}) }
  }


  return (
    <Permission code={PermissionCodes.PROJECT_LEADER} project={project} member={member} >
      <Box>
        <Button variant={'contained'} color="error" onClick={() => handleArchive()}>
          ARCHIVE PROJECT
        </Button>
      </Box>
    </Permission>
  );

}

export default ArchiveProjectForm;

