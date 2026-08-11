import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_config.dart';

/// Builds the app's ThemeData from AppConfig constants.
/// To re-brand the app (including fonts), only AppConfig needs to change.
class AppTheme {
  // ── Font helpers ──────────────────────────────────────────────────────────

  /// Headline font — used for article titles, display text, large headings.
  static TextStyle headline(
    double size,
    FontWeight weight, {
    Color? color,
    double? height,
    double? letterSpacing,
  }) =>
      GoogleFonts.getFont(
        AppConfig.headlineFontFamily,
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: letterSpacing,
      );

  /// Body font — used for body text, labels, buttons, metadata.
  static TextStyle body(
    double size,
    FontWeight weight, {
    Color? color,
    double? height,
    double? letterSpacing,
  }) =>
      GoogleFonts.getFont(
        AppConfig.bodyFontFamily,
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: letterSpacing,
      );

  // ── Text theme ────────────────────────────────────────────────────────────

  static TextTheme get _textTheme => TextTheme(
        displayLarge: headline(57, FontWeight.w400),
        displayMedium: headline(45, FontWeight.w400),
        displaySmall: headline(36, FontWeight.w400),
        headlineLarge: headline(32, FontWeight.w700),
        headlineMedium: headline(28, FontWeight.w700),
        headlineSmall: headline(24, FontWeight.w700),
        titleLarge: headline(22, FontWeight.w700),
        titleMedium: body(16, FontWeight.w600),
        titleSmall: body(14, FontWeight.w600),
        bodyLarge: body(16, FontWeight.w400, height: 1.7),
        bodyMedium: body(14, FontWeight.w400, height: 1.6),
        bodySmall: body(12, FontWeight.w400),
        labelLarge: body(14, FontWeight.w600),
        labelMedium: body(12, FontWeight.w500),
        labelSmall: body(11, FontWeight.w500),
      );

  // ── Theme ─────────────────────────────────────────────────────────────────

  static ThemeData get light => _buildTheme(Brightness.light);

  static ThemeData get dark => _buildTheme(Brightness.dark);

  static ThemeData _buildTheme(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final textTheme = _textTheme.apply(
      bodyColor: isDark ? AppConfig.onSurfaceDark : null,
      displayColor: isDark ? AppConfig.onSurfaceDark : null,
    );

    final surfaceColor =
        isDark ? AppConfig.surfaceColorDark : AppConfig.surfaceColor;
    final cardColor = isDark ? AppConfig.cardColorDark : AppConfig.cardColor;
    final appBarColor = isDark ? AppConfig.cardColorDark : Colors.white;
    final inputFillColor = isDark ? AppConfig.cardColorDark : Colors.white;
    final borderColor =
        isDark ? Colors.grey.shade700 : Colors.grey.shade200;
    final mutedColor =
        isDark ? AppConfig.mutedTextDark : Colors.grey;
    final shadowColor = isDark ? Colors.black54 : Colors.black26;

    final colorScheme = ColorScheme.fromSeed(
      seedColor: AppConfig.primaryColor,
      primary: AppConfig.primaryColor,
      secondary: AppConfig.accentColor,
      surface: surfaceColor,
      onSurface: isDark ? AppConfig.onSurfaceDark : Colors.black87,
      onSurfaceVariant: isDark ? AppConfig.mutedTextDark : Colors.grey.shade600,
      brightness: brightness,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: colorScheme,
      textTheme: textTheme,
      primaryTextTheme: textTheme,
      scaffoldBackgroundColor: surfaceColor,
      dividerColor: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
      appBarTheme: AppBarTheme(
        backgroundColor: appBarColor,
        foregroundColor: AppConfig.primaryColor,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: isDark ? Colors.black45 : Colors.black12,
        titleTextStyle: headline(
          20,
          FontWeight.w700,
          color: AppConfig.primaryColor,
          letterSpacing: -0.5,
        ),
      ),
      cardTheme: CardThemeData(
        color: cardColor,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: EdgeInsets.zero,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: AppConfig.primaryColor.withAlpha(isDark ? 40 : 20),
        labelStyle: body(
          11,
          FontWeight.w600,
          color: AppConfig.primaryColor,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        side: BorderSide.none,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: appBarColor,
        indicatorColor: AppConfig.primaryColor.withAlpha(30),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: AppConfig.primaryColor);
          }
          return IconThemeData(color: mutedColor);
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return body(12, FontWeight.w600, color: AppConfig.primaryColor);
          }
          return body(12, FontWeight.w400, color: mutedColor);
        }),
        elevation: 8,
        shadowColor: shadowColor,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: inputFillColor,
        hintStyle: body(14, FontWeight.w400, color: mutedColor),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppConfig.primaryColor, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppConfig.primaryColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          padding: const EdgeInsets.symmetric(vertical: 14),
          textStyle: body(15, FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppConfig.primaryColor,
          side: const BorderSide(color: AppConfig.primaryColor),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          padding: const EdgeInsets.symmetric(vertical: 14),
          textStyle: body(15, FontWeight.w600),
        ),
      ),
      listTileTheme: ListTileThemeData(
        iconColor: isDark ? AppConfig.mutedTextDark : Colors.grey.shade600,
        textColor: isDark ? AppConfig.onSurfaceDark : Colors.black87,
      ),
    );
  }
}
