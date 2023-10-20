import React, { useContext } from "react"
import RegisterForm from "../forms/RegisterForm"

import DraggableDialog from "@/fx/ui/DraggableDialog"
import { DialogActions, AppDialogs } from "@/react/app/app-types"
import { AppContext } from "@/react/app"


export default function RegisterDialog() {

  const {app, dialogActions} = useContext(AppContext)

  const handleCloseDialog = () => {
    dialogActions({type: DialogActions.Close, dialog: AppDialogs.Reg})
  }

  const handleOpenAuthDialog = () => {
    dialogActions({type: DialogActions.Open, dialog: AppDialogs.Auth})
  }

  return (
    <DraggableDialog dialogIsOpen={app.regDialogIsOpen}
      ariaLabel="register-dialog" title="REGISTER" >
      <RegisterForm closeDialog={handleCloseDialog} openAuthDialog={handleOpenAuthDialog}/>
    </DraggableDialog>
  )
}

// QA: Brian Francis 08-23-23