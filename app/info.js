import { View, Text, ScrollView, TouchableOpacity, Image, Platform } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LayoutGrid, Lightbulb, Github, ShieldCheck, ExternalLink } from "lucide-react-native";
import * as Linking from "expo-linking";
import { useTheme } from "../hooks/useTheme";

const REPO_URL = "https://github.com/CamiloCuenca/PomoTimerFlow";
const PRIVACY_URL = "https://camilocuenca.github.io/PomoTimerFlow/privacy-policy.html";
const CREATOR_URL = "https://github.com/CamiloCuenca";

export default function InfoScreen() {
  const { theme } = useTheme();

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn("No se pudo abrir el enlace", e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bgMain }}>
      <Stack.Screen
        options={{
          title: "Sobre la app",
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.bgMain },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />

      <ScrollView
        style={{ flex: 1, padding: 16 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Section
          icon="apps-outline"
          title="PomoTimerFlow"
          subtitle="Enfócate, mide tu tiempo y celebra tus logros."
          theme={theme}
        />

        <Row label="Versión" value="1.2.0" theme={theme} />

        {/* Creador con avatar al lado del nombre */}
        <TouchableOpacity
          onPress={() => openLink(CREATOR_URL)}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomColor: theme.colors.secondary,
            borderBottomWidth: 1,
            marginBottom: 4,
          }}
        >
          <Text style={{ color: theme.colors.textSecondary }}>Creador</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
              Juan Camilo Cuenca Sepúlveda
            </Text>
            <Image
              source={{ uri: "https://github.com/CamiloCuenca.png" }}
              style={{ width: 42, height: 42, borderRadius: 21, marginLeft: 10 }}
            />
          </View>
        </TouchableOpacity>

        

        <LinkRow
          icon="logo-github"
          label="Repositorio"
          url={REPO_URL}
          theme={theme}
          onPress={openLink}
        />
    
        <LinkRow
          icon="shield-checkmark-outline"
          label="Política de privacidad"
          url={PRIVACY_URL}
          theme={theme}
          onPress={openLink}
        />

        <SectionDivider theme={theme} />

        <Section
          icon="bulb-outline"
          title="Notas"
          subtitle="Gracias por usar la app. Comparte sugerencias o reporta errores en el repo."
          theme={theme}
        />
      </ScrollView>
    </View>
  );
}

function Section({ icon, title, subtitle, theme }) {
  const renderIcon = () => {
    if (Platform.OS === "web") {
      switch (icon) {
        case "apps-outline":
          return <LayoutGrid size={24} color={theme.colors.text} />;
        case "bulb-outline":
          return <Lightbulb size={24} color={theme.colors.text} />;
        default:
          return <LayoutGrid size={24} color={theme.colors.text} />;
      }
    }
    return <Ionicons name={icon} size={24} color={theme.colors.text} />;
  };

  return (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.secondary,
        }}
      >
        {renderIcon()}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700" }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function Row({ label, value, theme }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: theme.colors.secondary,
        borderBottomWidth: 1,
      }}
    >
      <Text style={{ color: theme.colors.textSecondary }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

function LinkRow({ icon, label, url, theme, onPress }) {
  const renderIcon = () => {
    if (Platform.OS === "web") {
      switch (icon) {
        case "logo-github":
          return <Github size={22} color={theme.colors.text} />;
        case "shield-checkmark-outline":
          return <ShieldCheck size={22} color={theme.colors.text} />;
        default:
          return <ExternalLink size={22} color={theme.colors.text} />;
      }
    }
    return <Ionicons name={icon} size={22} color={theme.colors.text} />;
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(url)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 10,
      }}
    >
      {renderIcon()}
      <Text style={{ color: theme.colors.text, fontWeight: "600", flex: 1 }}>
        {label}
      </Text>
      {Platform.OS === "web" ? (
        <ExternalLink size={18} color={theme.colors.textSecondary} />
      ) : (
        <Ionicons name="open-outline" size={18} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

function SectionDivider({ theme }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.colors.secondary,
        marginVertical: 12,
      }}
    />
  );
}
