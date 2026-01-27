import "./styles.css";
import React from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import InventoryListPage from "./pages/InventoryListPage";
import InventoryItemPage from "./pages/InventoryItemPage";
import InventoryQuickUpdatePage from "./pages/InventoryQuickUpdatePage";

function AppShell() {
  const { user, logout, isLoading } = useAuth();
  const { theme } = useTheme();
  const [screen, setScreen] = React.useState({ name: "inventory:list", itemId: null });

  if (isLoading) {
    return <div className="app">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="app">
        <h1>InvenX</h1>
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>InvenX</h1>
      <div className="card">
        <div className="row">
          <div>
            <div className="muted">Signed in as</div>
            <div>
              <strong>{user.name}</strong> ({user.dbid})
            </div>
          </div>
          <button className="btn" onClick={logout}>
            Sign out
          </button>
        </div>

        <div className="muted" style={{ marginTop: 12 }}>
          Theme preview (from your user profile colors):
        </div>
        <div className="themePreview">
          <div className="swatch" style={{ background: theme.bg }}>
            bg
          </div>
          <div className="swatch" style={{ background: theme.border }}>
            border
          </div>
          <div className="swatch" style={{ background: theme.chart }}>
            chart
          </div>
          <div className="swatch" style={{ background: theme.font, color: "#000" }}>
            font
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: "flex-start", gap: 10, marginBottom: 12 }}>
          <button
            className="btn"
            onClick={() => setScreen({ name: "inventory:list", itemId: null })}
            disabled={screen.name === "inventory:list"}
          >
            Full page
          </button>
          <button
            className="btn"
            onClick={() => setScreen({ name: "inventory:quick", itemId: null })}
            disabled={screen.name === "inventory:quick"}
          >
            Quick update
          </button>
        </div>

        {screen.name === "inventory:list" ? (
          <InventoryListPage
            onCreateNew={() => setScreen({ name: "inventory:item", itemId: null })}
            onOpenItem={(id) => setScreen({ name: "inventory:item", itemId: id })}
          />
        ) : null}

        {screen.name === "inventory:quick" ? (
          <InventoryQuickUpdatePage
            onOpenFullEdit={(id) => setScreen({ name: "inventory:item", itemId: id })}
          />
        ) : null}

        {screen.name === "inventory:item" ? (
          <InventoryItemPage
            itemId={screen.itemId}
            onBack={() => setScreen({ name: "inventory:list", itemId: null })}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}

