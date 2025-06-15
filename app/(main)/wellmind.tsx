import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import WellMindLogo from '../../assets/images/WellMind_logo_svg.svg';
import { supabase } from '../../lib/supabase';

export default function WellMindScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState('');
  const [mainGoal, setMainGoal] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayISO = new Date(today).toISOString(); // Format to full timestamp string

  useEffect(() => {
    loadTodayMood();
    loadMainGoal();
  }, []);

  const loadTodayMood = async () => {
    const { data } = await supabase
      .from('mood_logs')
      .select('mood')
      .eq('logged_at', todayISO)
      .single();

    if (data?.mood) {
      setSelectedMood(data.mood);
    }
  };

  const loadMainGoal = async () => {
    const { data, error } = await supabase
      .from('daily_goals')
      .select('title')
      .eq('show_on_home', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setMainGoal(data.title);
    }
  };

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);

    const { data } = await supabase
      .from('mood_logs')
      .select('id')
      .eq('logged_at', todayISO)
      .single();

    if (data?.id) {
      await supabase.from('mood_logs').update({ mood }).eq('id', data.id);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('mood_logs').insert({
          mood,
          user_id: user.id,
          logged_at: todayISO,
        });
      }
    }
  };

  const moodDescription: Record<string, string> = {
    '😐': 'Feeling neutral',
    '🙂': 'Feeling happy',
    '😔': 'Feeling sad',
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/images/velvet.jpg')}
        style={styles.background}
        resizeMode='cover'
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.logoWrapper}>
              <WellMindLogo width={140} height={140} />
              <Text style={styles.title}>WellMind</Text>
              <Text style={styles.subtitle}>Your mental wellness center</Text>
            </View>

            {/* MAIN GOAL */}
            {mainGoal && (
              <View style={styles.goalBox}>
                <Text style={styles.goalText}>🎯 Today's Goal: {mainGoal}</Text>
              </View>
            )}

            {/* MOODS */}
            <Text style={styles.moodPrompt}>How are you feeling today?</Text>
            <View style={styles.emojiRow}>
              {['😐', '🙂', '😔'].map(emoji => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => handleMoodSelect(emoji)}
                >
                  <Text
                    style={[
                      styles.emoji,
                      selectedMood === emoji && styles.emojiSelected,
                    ]}
                  >
                    {emoji}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedMood && (
              <Text style={styles.moodLabel}>
                {moodDescription[selectedMood]}
              </Text>
            )}
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footerBox}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(tabs)/journal')}
            >
              <Text style={styles.footerButtonText}>Journal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => router.push('/(tabs)/goals')}
            >
              <Text style={styles.footerButtonText}>Goals</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between', padding: 20 },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  title: { fontSize: 36, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 18, color: '#000' },
  goalBox: {
    backgroundColor: '#cdb4db',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
  },
  goalText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  moodPrompt: { fontSize: 18, marginBottom: 12, color: '#000' },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
    opacity: 0.5,
  },
  emojiSelected: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    color: '#000',
  },
  footerBox: {
    flexDirection: 'row',
    backgroundColor: '#b5838d',
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#6a66a3',
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: { color: '#fff', fontWeight: 'bold' },
});
