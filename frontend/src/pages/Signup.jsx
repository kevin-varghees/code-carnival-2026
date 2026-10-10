import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { errMsg } from '../api/client';
import { 
  Sparkles, User, Mail, Lock, ArrowRight, GraduationCap, 
  Building2, BookOpen, Github, Linkedin, Loader2 
} from 'lucide-react';

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: '',
    email: '', 
    password: '',
    graduationStatus: '',
    university: '',
    course: '',
    github: '',
    linkedin: '',
    interests: []
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableInterests = [
    'Web Development', 'AI & Machine Learning', 'UI/UX Design', 
    'Cloud & DevOps', 'Cybersecurity', 'Blockchain & Web3', 
    'Mobile App Dev', 'Data Science', 'Product Management'
  ];

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSocialLogin = (provider) => {
    alert(`Connecting to ${provider}... OAuth integration required on the backend.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        graduation_status: formData.graduationStatus,
        university: formData.university,
        course: formData.course,
        github: formData.github,
        linkedin: formData.linkedin,
        interests: formData.interests
      };

      const { data } = await api.post('/api/auth/register', payload);
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setError(errMsg(err, 'Failed to create account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-500/30 pt-24 pb-12">
      
      {/* Ambient Dark Green Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-950/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.02] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Personalize Your Experience
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-3">Create Your Account</h1>
        <p className="text-zinc-400 text-sm md:text-base font-medium max-w-md mx-auto">
          Join the campus network. Tell us a bit about yourself so we can match you with the best events and peers.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-[#0a0f0d]/80 backdrop-blur-2xl border border-emerald-900/30 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        {/* SOCIAL LOGIN ACCELERATORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button 
            type="button" 
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center gap-3 px-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all shadow-inner group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-semibold text-zinc-200">Continue with Google</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => handleSocialLogin('WhatsApp')}
            className="flex items-center justify-center gap-3 px-4 py-3.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-all shadow-inner group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span className="text-sm font-semibold text-emerald-400">Continue with WhatsApp</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-zinc-800/80"></div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Or register with email</span>
          <div className="flex-1 h-px bg-zinc-800/80"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: Personal Info */}
          <div>
            <h3 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-2 mb-4">Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Full Name</label>
                <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
                  <User className="absolute left-4 w-4 h-4 pointer-events-none" />
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner" placeholder="Alex Rivera" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Email Address</label>
                <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
                  <Mail className="absolute left-4 w-4 h-4 pointer-events-none" />
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner" placeholder="alex@university.edu" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Password</label>
                <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
                  <Lock className="absolute left-4 w-4 h-4 pointer-events-none" />
                  <input type="password" required minLength="6" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Background */}
          <div>
            <h3 className="text-sm font-bold text-white border-b border-zinc-800/80 pb-2 mb-4">Academic Background</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Current Status</label>
                <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
                  <GraduationCap className="absolute left-4 w-4 h-4 pointer-events-none" />
                  <select 
                    value={formData.graduationStatus} 
                    onChange={(e) => setFormData({ ...formData, graduationStatus: e.target.value })}
                    className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-zinc-500">Select Status...</option>
                    <option value="High School">High School Student</option>
                    <option value="Undergraduate">Undergraduate (Bachelors)</option>
                    <option value="Postgraduate">Postgraduate (Masters/PhD)</option>
                    <option value="Graduated">Alumni / Graduated</option>
                    <option value="Professional">Working Professional</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">University / College</label>
                <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
                  <Building2 className="absolute left-4 w-4 h-4 pointer-events-none" />
                  <input type="text" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner" placeholder="E.g., Stanford University" />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Course / Major</label>
                <div className="relative flex items-center focus-within:text-emerald-400 text-zinc-500 transition-colors">
                  <BookOpen className="absolute left-4 w-4 h-4 pointer-events-none" />
                  <input type="text" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-inner" placeholder="E.g., B.Tech Computer Science" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Social & Areas of Interest */}
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-4">
              <h3 className="text-sm font-bold text-white">Profile & Links</h3>
              <span className="text-[10px] uppercase font-bold text-zinc-500">Optional</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="relative flex items-center focus-within:text-white text-zinc-500 transition-colors">
                <Github className="absolute left-4 w-4 h-4 pointer-events-none" />
                <input type="text" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all" placeholder="github.com/username" />
              </div>
              <div className="relative flex items-center focus-within:text-blue-400 text-zinc-500 transition-colors">
                <Linkedin className="absolute left-4 w-4 h-4 pointer-events-none" />
                <input type="text" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full bg-[#050505] border border-zinc-800/80 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all" placeholder="linkedin.com/in/username" />
              </div>
            </div>

            {/* Interactive Areas of Interest */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">Select Your Areas of Interest</label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                          : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse"><Loader2 className="w-4 h-4 animate-spin" /> Setting up your profile...</span>
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="mt-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <p className="text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group">
            Sign in here <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      </div>

    </div>
  );
}