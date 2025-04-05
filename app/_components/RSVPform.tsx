"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { strings } from "@/app/utils/strings";
import { submitRSVP } from "../actions/submitRSVP";
import { toast } from "sonner"; // ✅ Correctly importing toast from Sonner

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accompany, setAccompany] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("yes");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("accompany", accompany || "0");
    formData.append("attendance", attendance);

    setIsLoading(true);
    const result = await submitRSVP(formData);

    if (result.success) {
      toast.success(strings.thankYouMessage); // ✅ Using toast.success for success messages

      // Reset form
      setName("");
      setEmail("");
      setAccompany(null);
      setAttendance("yes");
      setErrors({});
    } else {
      toast.error(result.message); // ✅ Using toast.error for error messages

      if (result.error && result.error.code === "23505") {
        setErrors({ email: "Email already exists" });
      }
    }
    setIsLoading(false);
  };

  const openGoogleMaps = () => {
    const encodedLocation = encodeURIComponent(strings.eventLocation);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">{strings.title}</h1>
      <p className="mb-6">{strings.description}</p>
      <div className="mb-6">
        <Label className="mb-2 text-1xl">{strings.eventDateLabel}</Label>
        <Calendar
          mode="single"
          selected={new Date(strings.eventDate)}
          className="rounded-md border flex flex-col items-center"
          fromDate={new Date(strings.eventDate)}
          toDate={new Date(strings.eventDate)}
          defaultMonth={new Date(strings.eventDate)}
          ISOWeek
        />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={openGoogleMaps}
            className="w-full"
          >
            <MapPin className="mr-2" />
            {strings.viewOnMapButton}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="mb-2" htmlFor="name">{strings.nameLabel}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <Label className="mb-1" htmlFor="email">{strings.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <Label className="mb-2" htmlFor="accompany">{strings.accompanyLabel}</Label>
          <Input
            id="accompany"
            type="number"
            min="0"
            value={accompany || ""}
            onChange={(e) => setAccompany(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2">{strings.rsvpLabel}</Label>
          <RadioGroup value={attendance} onValueChange={setAttendance}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yes" id="yes" />
              <Label className="mb-2" htmlFor="yes">{strings.yesOption}</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="no" id="no" />
              <Label className="mb-2" htmlFor="no">{strings.noOption}</Label>
            </div>
          </RadioGroup>
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Sending..." : strings.submitButton}
        </Button>
      </form>
    </div>
  );
}
