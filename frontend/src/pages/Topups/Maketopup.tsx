import StyledDropzone from '@/components/StyledDropZone';
import ToggleSwitch from '@/components/ToggleSwitch';
import { Button } from '@/components/ui/button';
import  { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input'
import { UploadIcon, User, UserPlus, UserPlus2 } from 'lucide-react';
import React from 'react'
import Dropzone from "react-dropzone";

const MakeTopUpPage = () => {
  return (
    <section className="py-14 px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-[1.3rem] font-semibold">
            Single top up
          </CardTitle>
          <CardDescription className="text-[.9rem]">
            Make top ups to a single recipient
          </CardDescription>

          <CardAction>
            <User />
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <label htmlFor="PhoneNo">Recipient phone number</label>
            <Input type="text" id="PhoneNo" />
            <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Next
            </Button>
            <div>
              {/* Detected operator */}
              <div>
                <img src="" />
              </div>
              <div>We detected safaricom kenya</div>
            </div>
            <label htmlFor="amount">Add amount</label>
            <Input type="number" />
            <Button type="submit" />
          </form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[1.3rem] font-semibold">
            Bulk top up
          </CardTitle>
          <CardDescription className="text-[.9rem]">
            Make top ups to multiple recipients at once by uploading a csv file
            with the folowing details, phone number operator and amount
          </CardDescription>

          <CardAction>
            <UserPlus />
          </CardAction>
        </CardHeader>
        <CardContent>
          <StyledDropzone >
           
          </StyledDropzone>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </section>
  );
}

export default MakeTopUpPage