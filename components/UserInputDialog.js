import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "./ui/textarea";

const UserInputDialog = ({children, studyList}) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{studyList.name}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-3">
                <h2>Enter a topic to master your skilss in {studyList.name}</h2>
                <Textarea className="mt-3 text-black" placeholder="Enter your topic here..." />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
