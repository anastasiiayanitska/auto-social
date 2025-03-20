import React, { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchComponentProps {
  placeholder: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
  fullWidth?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  placeholder,
  onSearch,

  initialQuery = "",
  fullWidth = true,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce search
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      onSearch(value);
    }, 300);

    setTypingTimeout(timeout);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={1}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: fullWidth ? "100%" : "auto",
        maxWidth: fullWidth ? "100%" : "500px",
        borderRadius: "4px",
        mb: 2,
      }}
    >
      <TextField
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {query ? (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  aria-label="clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        }}
        sx={{ ml: 1, flex: 1 }}
      />
    </Paper>
  );
};

export default SearchComponent;
