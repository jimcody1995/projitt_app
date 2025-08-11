import axios from "axios";

export const sendApplicantOTP = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/user/send-applicant-otp`, data);
    return response.data;
}

export const verifyApplicantOTP = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/user/verify-applicant-otp`, data);
    return response.data;
}

export const applicantContactInfo = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/edit-applicant-contact-info`, data);
    return response.data;
}

export const applicantResume = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/edit-applicant-cv-cover`, data);
    return response.data;
}

export const applicantExperienceAdd = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-experience-add`, data);
    return response.data;
}

export const applicantCertificateAdd = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-certificate-add`, data);
    return response.data;
}

export const applicantEducationAdd = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-education-add`, data);
    return response.data;
}

export const applicantExperienceEdit = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-experience-edit`, data);
    return response.data;
}

export const applicantCertificateEdit = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-certificate-edit`, data);
    return response.data;
}

export const applicantEducationEdit = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-education-edit`, data);
    return response.data;
}

export const applicantExperienceDelete = async (id: number) => {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-experience-delete`, { params: { ids: [id] } });
    return response.data;
}

export const applicantCertificateDelete = async (id: number) => {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-certificate-delete`, { params: { ids: [id] } });
    return response.data;
}

export const applicantEducationDelete = async (id: number) => {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-education-delete`, { params: { ids: [id] } });
    return response.data;
}

export const editApplicantInfo = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/edit-applicant-info`, data);
    return response.data;
}

export const getQuestions = async (jobId: string, applicantId: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-questions-answers`, { params: { job_id: jobId, applicant_id: applicantId } });
    return response.data;
}

export const updateQuestionAnswer = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-questions-answers/update`, data);
    return response.data;
}

export const getApplicantInfo = async (jobId: string, applicantId: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-single`, { params: { job_id: jobId, applicant_id: applicantId } });
    return response.data;
}

export const submitApplicant = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-submit`, data);
    return response.data;
}

export const getJobInfo = async (jobId: string, applicantId: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/get-applicant-jobs`, { params: { job_id: jobId, applicant_id: applicantId } });
    return response.data;
}

export const updateApplicantEmail = async (data: any) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/job/applicant-change-email`, data);
    return response.data;
}
