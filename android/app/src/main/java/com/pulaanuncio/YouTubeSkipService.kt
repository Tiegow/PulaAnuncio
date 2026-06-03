package com.pulaanuncio

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class YouTubeSkipService : AccessibilityService() {

    private val TAG = "PulaAnuncio"
    private var isMutedByUs = false
    private var originalVolume = -1

    override fun onServiceConnected() {
        super.onServiceConnected()
        // Log.d(TAG, "YouTubeSkipService Conectado!")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (event.packageName?.toString() != "com.google.android.youtube") return

        val prefs = getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
        val skipEnabled = prefs.getBoolean("skip_enabled", true)
        val muteEnabled = prefs.getBoolean("mute_enabled", false)

        if (!skipEnabled && !muteEnabled) return

        val rootNode = rootInActiveWindow ?: return

        val skipNode = findSkipNode(rootNode)
        
        if (skipNode != null) {
            // Anúncio detectado (pode ou não estar pronto para pular)
            if (muteEnabled && !isMutedByUs) {
                muteMedia()
            }

            if (skipEnabled && skipNode.isClickable && skipNode.isEnabled) {
                performSkip(skipNode)
            }
            skipNode.recycle()
        } else {
            // Nenhum anúncio detectado
            if (isMutedByUs) {
                unmuteMedia()
            }
        }

        rootNode.recycle()
    }

    private fun muteMedia() {
        try {
            val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            originalVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC)
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, 0, 0)
            isMutedByUs = true
            // Log.d(TAG, "Mídia silenciada.")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao silenciar mídia", e)
        }
    }

    private fun unmuteMedia() {
        try {
            val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            if (originalVolume != -1) {
                audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, originalVolume, 0)
                originalVolume = -1
            }
            isMutedByUs = false
            // Log.d(TAG, "Mídia restaurada.")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao restaurar mídia", e)
        }
    }

    private fun findSkipNode(node: AccessibilityNodeInfo): AccessibilityNodeInfo? {
        val idsToSearch = listOf(
            "com.google.android.youtube:id/skip_ad_button",
            "com.google.android.youtube:id/ad_skip_button"
        )
        for (id in idsToSearch) {
            val nodes = node.findAccessibilityNodeInfosByViewId(id)
            if (nodes.isNotEmpty()) {
                val target = nodes[0]
                for (i in 1 until nodes.size) {
                    nodes[i].recycle()
                }
                return target
            }
        }

        val textsToSearch = listOf("Pular anúncio", "Skip Ad", "Pular Anúncio", "Skip ad")
        for (text in textsToSearch) {
            val nodes = node.findAccessibilityNodeInfosByText(text)
            if (nodes.isNotEmpty()) {
                val target = nodes[0]
                for (i in 1 until nodes.size) {
                    nodes[i].recycle()
                }
                return target
            }
        }
        return null
    }

    private fun performSkip(node: AccessibilityNodeInfo) {
        // Log.d(TAG, "Tentando clicar no botão de skip...")
        val result = node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
        
        if (result) {
            // Log.d(TAG, "Anúncio pulado com sucesso!")
            
            val prefs = getSharedPreferences("PulaAnuncioPrefs", Context.MODE_PRIVATE)
            val currentCount = prefs.getInt("skip_count", 0)
            val newCount = currentCount + 1
            prefs.edit().putInt("skip_count", newCount).apply()

            // Desmuta imediatamente após o skip para não perder o início do vídeo
            if (isMutedByUs) {
                unmuteMedia()
            }

            // Envia broadcast para o React Native atualizar a UI
            val intent = Intent("com.pulaanuncio.AD_SKIPPED")
            intent.putExtra("skip_count", newCount)
            sendBroadcast(intent)
        } else {
            // Log.d(TAG, "Falha ao clicar no nó de skip.")
        }
    }

    override fun onInterrupt() {
        // Log.d(TAG, "YouTubeSkipService Interrompido!")
        if (isMutedByUs) {
            unmuteMedia()
        }
    }
}
