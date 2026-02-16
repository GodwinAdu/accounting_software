import Heading from '@/components/commons/Header'
import { DataTable } from '@/components/table/data-table'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/column'

const page = () => {
  return (
    <>
    <div className="flex justify-between items-center">
        <Heading title="All Members" description="View and manage all members in your organization" />
        <Link href="" className={cn(buttonVariants())}>Create Member</Link>
    </div>
    <Separator />
    <div className="py-4">
        <DataTable searchKey='' columns={columns} data={[]} />
    </div>
    </>
  )
}

export default page