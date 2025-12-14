import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { Upload, X, Plus, Trash2, Edit } from 'lucide-react';

const EditProfile = () => {
  const { user, fetchUser, PLATFORM_URL } = useAuth();
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handlePhotoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setLoading(true);
      const endpoint = type === 'profile' ? '/user/profile-photo' : '/user/cover-photo';
      await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`${type === 'profile' ? 'Profile' : 'Cover'} photo updated!`);
      fetchUser();
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put('/user/profile', formData);
      toast.success('Profile updated successfully!');
      fetchUser();
      navigate(`/profile/${user._id}`);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const [workExp, setWorkExp] = useState([]);
  const [education, setEducation] = useState([]);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);
  const [workForm, setWorkForm] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  });
  const [eduForm, setEduForm] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
  });

  useEffect(() => {
    if (user) {
      setWorkExp(user.workExperience || []);
      setEducation(user.education || []);
    }
  }, [user]);

  const addWorkExperience = async () => {
    try {
      const response = await axios.post('/user/work-experience', workForm);
      toast.success('Work experience added!');
      setWorkExp(response.data.user.workExperience);
      setWorkForm({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      });
      setShowWorkForm(false);
      fetchUser();
    } catch (error) {
      toast.error('Failed to add work experience');
    }
  };

  const deleteWorkExperience = async (id) => {
    try {
      const response = await axios.delete(`/user/work-experience/${id}`);
      toast.success('Work experience deleted!');
      setWorkExp(response.data.user.workExperience);
      fetchUser();
    } catch (error) {
      toast.error('Failed to delete work experience');
    }
  };

  const addEducation = async () => {
    try {
      const response = await axios.post('/user/education', eduForm);
      toast.success('Education added!');
      setEducation(response.data.user.education);
      setEduForm({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
      });
      setShowEduForm(false);
      fetchUser();
    } catch (error) {
      toast.error('Failed to add education');
    }
  };

  const deleteEducation = async (id) => {
    try {
      const response = await axios.delete(`/user/education/${id}`);
      toast.success('Education deleted!');
      setEducation(response.data.user.education);
      fetchUser();
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-4 md:py-6">
      <h1 className="text-2xl sm:text-3xl font-light mb-6">Edit Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <img
              src={
                user.profilePhoto
                  ? `${PLATFORM_URL}${user.profilePhoto}`
                  : `https://ui-avatars.com/api/?name=${user.username}&background=random`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'profile')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Cover Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Photo
          </label>
          <div className="flex items-center gap-4">
            {user.coverPhoto ? (
              <img
                src={`${PLATFORM_URL}${user.coverPhoto}`}
                alt="Cover"
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
            )}
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, 'cover')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </form>

        {/* Work Experience */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Work Experience</h2>
            <button
              onClick={() => setShowWorkForm(!showWorkForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {showWorkForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                placeholder="Position"
                value={workForm.position}
                onChange={(e) => setWorkForm({ ...workForm, position: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Company"
                value={workForm.company}
                onChange={(e) => setWorkForm({ ...workForm, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={workForm.startDate}
                  onChange={(e) => setWorkForm({ ...workForm, startDate: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={workForm.endDate}
                  onChange={(e) => setWorkForm({ ...workForm, endDate: e.target.value })}
                  disabled={workForm.current}
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-200"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={workForm.current}
                  onChange={(e) => setWorkForm({ ...workForm, current: e.target.checked })}
                />
                Currently working here
              </label>
              <textarea
                placeholder="Description"
                value={workForm.description}
                onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={addWorkExperience}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowWorkForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {workExp.map((exp, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteWorkExperience(exp._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Education</h2>
            <button
              onClick={() => setShowEduForm(!showEduForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {showEduForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                placeholder="Degree"
                value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="School"
                value={eduForm.school}
                onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Field of Study"
                value={eduForm.field}
                onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={eduForm.startDate}
                  onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  placeholder="End Date"
                  value={eduForm.endDate}
                  onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                  disabled={eduForm.current}
                  className="flex-1 px-3 py-2 border rounded-lg disabled:bg-gray-200"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eduForm.current}
                  onChange={(e) => setEduForm({ ...eduForm, current: e.target.checked })}
                />
                Currently studying
              </label>
              <div className="flex gap-2">
                <button
                  onClick={addEducation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowEduForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    {edu.field && <p className="text-gray-600">{edu.field}</p>}
                    <p className="text-sm text-gray-500">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.current ? 'Present' : new Date(edu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEducation(edu._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

