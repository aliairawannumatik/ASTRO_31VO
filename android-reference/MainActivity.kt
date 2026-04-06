package com.example.numatik // Ganti dengan package name aplikasi Anda

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                return false
            }
        }

        // Daftarkan JavaScript Interface dengan nama "AndroidInterface"
        // Nama ini harus sama persis dengan yang dipanggil di sisi web:
        // window.AndroidInterface.finishAffinity()
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidInterface")

        // Muat URL aplikasi NUMATIK
        // Saat development: ganti dengan URL dev server lokal atau IP jaringan Anda
        // Saat produksi: ganti dengan URL produksi yang sudah di-deploy
        webView.loadUrl("https://your-numatik-app-url.com")
    }

    // Tangani tombol Back fisik Android
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}

/**
 * JavaScript Interface yang diekspos ke WebView.
 * Metode di sini dapat dipanggil dari JavaScript melalui window.AndroidInterface
 */
class WebAppInterface(private val activity: MainActivity) {

    /**
     * Dipanggil dari JavaScript: window.AndroidInterface.finishAffinity()
     * Menutup seluruh task stack aplikasi (semua Activity) dengan benar.
     * Ini adalah cara yang direkomendasikan untuk menutup aplikasi Android.
     */
    @JavascriptInterface
    fun finishAffinity() {
        activity.runOnUiThread {
            activity.finishAffinity()
        }
    }

    /**
     * Alias untuk kompatibilitas mundur.
     * Dipanggil dari JavaScript: window.AndroidInterface.exitApp()
     */
    @JavascriptInterface
    fun exitApp() {
        finishAffinity()
    }
}
