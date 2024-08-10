import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../http";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { PhotoCamera, Delete, Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditNote() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const { id } = useParams();

  const [note, setNote] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get(`/notes/${id}`).then((res) => {
      setNote(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
      console.log(res.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: note,
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters.")
        .max(100, "Title must be at most 100 characters.")
        .required("Title is required."),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters.")
        .max(500, "Description must be at most 500 characters.")
        .required("Description is required."),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.title = data.title.trim();
      data.description = data.description.trim();
      http
        .put(`/notes/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/notes");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update note");
        });
    },
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    navigate("/notes");
  };

  const deleteNote = () => {
    http
      .delete(`/notes/${id}`)
      .then((res) => {
        console.log(res.data);
        navigate("/notes");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete note");
      });
  };

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);

      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to upload image");
        });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 600,
          width: "100%",
          position: "relative",
          borderRadius: "12px",
        }}
      >
        <Tooltip title="Close">
          <IconButton
            color="secondary"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(255,255,255,0.8)",
              borderRadius: "50%",
            }}
            onClick={handleCancel}
          >
            <Close />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ flex: 1 }}>
            Edit Note
          </Typography>
        </Box>

        {!loading && (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              multiline
              minRows={3}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              variant="outlined"
            />

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Tooltip title="Upload Photo">
                <IconButton
                  color="primary"
                  component="label"
                  sx={{ borderRadius: "8px" }}
                >
                  <PhotoCamera />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={onFileChange}
                  />
                </IconButton>
              </Tooltip>
              {imageFile && (
                <Box sx={{ ml: 2, width: "300px", height: "200px" }}>
                  <img
                    alt="note"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                    style={{
                      maxWidth: "100%",
                      height: "100%",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                sx={{ borderRadius: "24px" }}
              >
                Update
              </Button>
              <Tooltip title="Delete Note">
                <IconButton color="error" onClick={handleOpen}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this note?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={deleteNote}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default EditNote;
