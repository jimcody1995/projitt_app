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
