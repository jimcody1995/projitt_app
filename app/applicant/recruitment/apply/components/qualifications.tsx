'use client';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import moment from 'moment';
import { CalendarDays, Plus } from 'lucide-react';
import { useState } from 'react';
import { useBasic } from '@/context/BasicContext';
import TagInput from '@/components/ui/tag-input';
import { applicantExperienceAdd, applicantCertificateAdd, applicantEducationAdd, editApplicantInfo } from '@/api/applicant';
export interface QualificationsRef {
}

interface WorkExperience {
  job_title: string;
  company: string;
  location: string;
  from_date: Date;
  to_date: Date;
  is_currently_working: boolean;
  role_description: string;
}

interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
}

interface Certifications {
  certification: string;
  certificationNumber: string;
  issueDate: Date;
  expiryDate: Date;
}

interface QualificationsProps {
  jobId: string | null;
  applicantId: string | null;
}

const Qualifications = forwardRef<QualificationsRef, QualificationsProps>(function QualificationsComponent({ jobId, applicantId }, ref) {
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [otherLinks, setOtherLinks] = useState<any>([]);
  const [tags, setTags] = useState<any>([]);
  const { skills } = useBasic();

  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const saveQualifications = async () => {
    if (!jobId || !applicantId) throw new Error('Missing job or applicant ID');
    // Work Experience
    try {
      for (const work of workExperience) {
        const payload = {
          job_id: Number(jobId),
          applicant_id: Number(applicantId),
          job_title: work.job_title,
          company: work.company,
          location: work.location,
          from_date: work.from_date ? moment(work.from_date).format('YYYY-MM-DD') : null,
          to_date: work.to_date ? moment(work.to_date).format('YYYY-MM-DD') : null,
          is_currently_working: work.is_currently_working,
          role_description: work.role_description,
        };
        await applicantExperienceAdd(payload);
      }
      // Certifications
      for (const cert of certifications) {
        const payload = {
          job_id: Number(jobId),
          applicant_id: Number(applicantId),
          title: cert.certification,
          number: cert.certificationNumber,
          issue_date: cert.issueDate ? moment(cert.issueDate).format('YYYY-MM-DD') : null,
          expiration_date: cert.expiryDate ? moment(cert.expiryDate).format('YYYY-MM-DD') : null,
        };
        await applicantCertificateAdd(payload);
      }
      // Education
      for (const edu of education) {
        const payload = {
          job_id: Number(jobId),
          applicant_id: Number(applicantId),
          school: edu.school,
          degree_id: Number(edu.degree),
          field_of_study: edu.fieldOfStudy,
        };
        await applicantEducationAdd(payload);
      }
      // Applicant Info
      const infoPayload = {
        job_id: Number(jobId),
        applicant_id: Number(applicantId),
        skill_ids: tags.map((v: any) => skills.find((s: any) => s.name === v)?.id || v),
        linkedin_link: linkedin,
        portfolio_link: portfolio,
        other_links: otherLinks,
      };
      const response = await editApplicantInfo(infoPayload);
      return response;
    } catch (error: any) {
      return error;
    }
  };
  useImperativeHandle(ref, () => ({
    saveQualifications
  }));
  return (
    <div>
      <p className="font-medium text-[22px]/[30px]">Qualifications</p>
      <p className="mt-[8px] text-[14px]/[13px] text-[#787878]">Add your contact information</p>
      <div className="mt-[15px] w-full h-[40px] border border-[#e9e9e9] rounded-[8px] flex justify-center items-center text-[#053834] font-semibold">
        File with Resume
      </div>
      <div className="mt-[36px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">Work experience</p>
        {workExperience.map((work, index) => (
          <>
            <div className="mt-[10px]">
              <p className="text-[14px]/[20px] text-[#8f8f8f]">Work Experience {index + 1}</p>
              <div className="mt-[12px] flex gap-[16px] sm:flex-row flex-col">
                <Input placeholder="Job Title" className="h-[48px]" value={work.job_title} onChange={(e) => setWorkExperience(workExperience.map((work, i) => i === index ? { ...work, job_title: e.target.value } : work))} />
                <Input placeholder="Company" className="h-[48px]" value={work.company} onChange={(e) => setWorkExperience(workExperience.map((work, i) => i === index ? { ...work, company: e.target.value } : work))} />
              </div>
              <Input className="w-full h-[48px] mt-[16px]" placeholder="Location (optional)" value={work.location} onChange={(e) => setWorkExperience(workExperience.map((work, i) => i === index ? { ...work, location: e.target.value } : work))} />
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-[16px] mt-[16px]">
                <div>
                  <Label>From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        mode="input"
                        variant="outline"
                        id="date"
                        className={cn(
                          'w-full h-[48px] data-[state=open]:border-primary',
                          !work.from_date && 'text-muted-foreground'
                        )}
                        data-test-id="certificate-issue-date"
                      >
                        <CalendarDays className="-ms-0.5" />
                        {moment(work.from_date).format('DD/MM/YYYY')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={work.from_date}
                        selected={work.from_date}
                        onSelect={(e) =>
                          setWorkExperience(workExperience.map((work, i) => i === index ? { ...work, from_date: e as Date } : work))
                        }
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        mode="input"
                        variant="outline"
                        id="date"
                        className={cn(
                          'w-full h-[48px] data-[state=open]:border-primary',
                          !work.to_date && 'text-muted-foreground'
                        )}
                        data-test-id="certificate-expiration-date"
                      >
                        <CalendarDays className="-ms-0.5" />
                        {moment(work.to_date).format('DD/MM/YYYY')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={work.to_date}
                        selected={work.to_date}
                        onSelect={(e) =>
                          setWorkExperience(workExperience.map((work, i) => i === index ? { ...work, to_date: e as Date } : work))
                        }
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center gap-[16px] mt-[12px]">
                <Checkbox checked={work.is_currently_working} onCheckedChange={(e) => setWorkExperience(workExperience.map((work, i) => i === index ? { ...work, is_currently_working: e as boolean } : work))} />
                <p className="text-[14px]/[20px] text-[#4b4b4b]">I currently work here</p>
              </div>
              <Textarea placeholder="Role Description" className="mt-[12px] h-[148px]" />
            </div>
          </>
        ))}
        <button
          className="flex gap-[6px] mt-[18px] items-center text-[#0D978B] cursor-pointer"
          onClick={() =>
            setWorkExperience([
              ...workExperience,
              { job_title: '', company: '', location: '', from_date: new Date(), to_date: new Date(), is_currently_working: false, role_description: '' },
            ])
          }
        >
          <Plus className="size-[18px]" />
          <p className="text-[14px]/[20px] ">Add another</p>
        </button>
      </div>
      <div className="mt-[36px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">Education</p>
        {education.map((edu, index) => (
          <>
            <div className="mt-[10px]">
              <p className="text-[14px]/[20px] text-[#8f8f8f]">Education {index + 1}</p>

              <Input className="w-full h-[48px] mt-[16px]" placeholder="School or University"
                value={edu.school}
                onChange={(e) => setEducation(education.map((edu, i) => i === index ? { ...edu, school: e.target.value } : edu))}
              />
              <Select className="w-full h-[48px] mt-[16px]" placeholder="Select Degree"
                value={edu.degree}
                onValueChange={(value) => setEducation(education.map((edu, i) => i === index ? { ...edu, degree: value } : edu))}
              >
                <SelectTrigger className="w-full h-[48px] mt-[16px] border border-[#e9e9e9] rounded-[8px]">
                  <SelectValue placeholder="Select Degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Qualification 1</SelectItem>
                  <SelectItem value="2">Qualification 2</SelectItem>
                  <SelectItem value="3">Qualification 3</SelectItem>
                </SelectContent>
              </Select>
              <Input className="w-full h-[48px] mt-[16px]" placeholder="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) => setEducation(education.map((edu, i) => i === index ? { ...edu, fieldOfStudy: e.target.value } : edu))}
              />
            </div>
          </>
        ))}
        <button
          className="flex gap-[6px] mt-[18px] items-center text-[#0D978B] cursor-pointer"
          onClick={() => setEducation([...education, { school: '', degree: '', fieldOfStudy: '' }])}
        >
          <Plus className="size-[18px]" />
          <p className="text-[14px]/[20px] ">Add another</p>
        </button>
      </div>

      <div className="mt-[36px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">Certifications</p>
        {certifications.map((cert, index) => (
          <>
            <div className="mt-[10px]">
              <Input className="w-full h-[48px] mt-[16px]" placeholder="Certification"
                value={cert.certification}
                onChange={(e) => setCertifications(certifications.map((cert, i) => i === index ? { ...cert, certification: e.target.value } : cert))}
              />
              <Input className="w-full h-[48px] mt-[16px]" placeholder="Certification Number"
                value={cert.certificationNumber}
                onChange={(e) => setCertifications(certifications.map((cert, i) => i === index ? { ...cert, certificationNumber: e.target.value } : cert))}
              />
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-[16px] mt-[16px]">
                <div>
                  <Label>Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        mode="input"
                        variant="outline"
                        id="date"
                        className={cn(
                          'w-full h-[48px] data-[state=open]:border-primary',
                          !cert.issueDate && 'text-muted-foreground'
                        )}
                        data-test-id="certificate-issue-date"
                      >
                        <CalendarDays className="-ms-0.5" />
                        {moment(cert.issueDate).format('DD/MM/YYYY')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={cert.issueDate}
                        selected={cert.issueDate}
                        onSelect={(e) =>
                          setCertifications(certifications.map((cert, i) => i === index ? { ...cert, issueDate: e as Date } : cert))
                        }
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        mode="input"
                        variant="outline"
                        id="date"
                        className={cn(
                          'w-full h-[48px] data-[state=open]:border-primary',
                          !cert.expiryDate && 'text-muted-foreground'
                        )}
                        data-test-id="certificate-expiration-date"
                      >
                        <CalendarDays className="-ms-0.5" />
                        {moment(cert.expiryDate).format('DD/MM/YYYY')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={cert.expiryDate}
                        selected={cert.expiryDate}
                        onSelect={(e) =>
                          setCertifications(certifications.map((cert, i) => i === index ? { ...cert, expiryDate: e as Date } : cert))
                        }
                        numberOfMonths={1}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </>
        ))}
        <button
          className="flex gap-[6px] mt-[18px] items-center text-[#0D978B] cursor-pointer"
          onClick={() =>
            setCertifications([
              ...certifications,
              {
                certification: '',
                certificationNumber: '',
                issueDate: new Date(),
                expiryDate: new Date(),
              },
            ])
          }
        >
          <Plus className="size-[18px]" />
          <p className="text-[14px]/[20px] ">Add another</p>
        </button>
      </div>
      <div className="mt-[32px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">Skills</p>
        <div className="mt-[16px]">
          <TagInput
            suggestions={skills || []}
            restrictToSuggestions={true}
            tags={tags}
            setTags={(tags) => setTags(tags)}
          />
        </div>
      </div>
      <div className="mt-[32px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">LinkedIn</p>
        <div className="mt-[16px]">
          <Input placeholder="LinkedIn" className="h-[48px]" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
        </div>
      </div>
      <div className="mt-[32px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">Website/Portfolio Link</p>
        <div className="mt-[16px]">
          <Input placeholder="Website/Portfolio Link" className="h-[48px]" value={portfolio} onChange={e => setPortfolio(e.target.value)} />
        </div>
      </div>
      <div className="mt-[32px]">
        <p className="font-medium text-[14px]/[22px] text-[#353535]">Other Links</p>
        {otherLinks.map((link, index) => (
          <div key={index} className="flex gap-[16px] mt-[16px] sm:flex-row flex-col">
            <Input
              placeholder="Title"
              value={link.title}
              onChange={(e) => setOtherLinks(otherLinks.map((link, i) => i === index ? { ...link, title: e.target.value } : link))}
              className="h-[48px] sm:w-[30%] w-full"
            />
            <Input
              placeholder="Link"
              value={link.link}
              onChange={(e) => setOtherLinks(otherLinks.map((link, i) => i === index ? { ...link, link: e.target.value } : link))}
              className="h-[48px] sm:w-[70%] w-full"
            />
          </div>
        ))}
        <button
          className="flex gap-[6px] mt-[18px] items-center text-[#0D978B] cursor-pointer"
          onClick={() =>
            setOtherLinks([
              ...otherLinks,
              {
                title: '',
                link: '',
              },
            ])
          }
        >
          <Plus className="size-[18px]" />
          <p className="text-[14px]/[20px] ">Add Link</p>
        </button>
      </div>
    </div>
  );
});

export default Qualifications;